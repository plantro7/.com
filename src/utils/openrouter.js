
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;

// Debug: Check if API Key is loaded (masked)
if (API_KEY) {
    console.log("API Key loaded:", API_KEY.substring(0, 8) + "...");
} else {
    console.error("API Key is MISSING! Please add VITE_GROQ_API_KEY to your .env file.");
}

/**
 * Compresses and resizes an image file to a maximum dimension of 800px.
 * @param {File} file 
 * @returns {Promise<string>} Base64 string of compressed image
 */
async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 800;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.7 quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Analyzes a plant image using Groq API (Llama 4 Scout).
 * @param {File} imageFile 
 * @returns {Promise<Object>}
 */
export const analyzeImageWithOpenRouter = async (imageFile) => {
    if (!API_KEY) {
        throw new Error("MISSING_API_KEY: API Key is missing. Please add VITE_GROQ_API_KEY to your .env file.");
    }

    try {
        console.log(`Starting image analysis... Original size: ${(imageFile.size / 1024).toFixed(2)} KB`);

        const base64Image = await compressImage(imageFile);

        // Calculate approximate size of base64 string
        const compressedSizeKB = (base64Image.length * 0.75) / 1024;
        console.log(`Compressed size: ${compressedSizeKB.toFixed(2)} KB`);

        const prompt = `
        Analyze this image of a plant. 
        1. Identify the plant name.
        2. Identify if it has any disease or if it is healthy.
        3. If diseased, provide the disease name, confidence level (0-1), description of symptoms, treatment, and recommended supplements.
        4. If healthy, provide care tips.
        5. CRITICAL: If the image contains a PERSON (even if holding a plant), or if it is an illustration/cartoon, or if the main subject is not a plant/fruit/vegetable, you MUST return "isUnknown": true.
        6. We only want to diagnose REAL PHOTOS of plants. If you are unsure, return "isUnknown": true.

        Return the result strictly as a valid JSON object with this structure:
        {
            "isUnknown": boolean,
            "name": "Disease Name" or "Healthy",
            "plantName": "Plant Name",
            "confidence": number (0.0 to 1.0),
            "reasoning": "Explain step-by-step why you reached this conclusion. Mention specific visual features you observed.",
            "description": "Short description or array of symptoms",
            "treatment": "Short treatment advice or array of steps",
            "recoveryTime": "Estimated time string",
            "supplements": [
                { 
                    "name": "Specific Product Name (e.g., Copper Fungicide, NPK 20-20-20)", 
                    "price": "Estimated Price in INR (just the number, e.g. 450)", 
                    "store": "Flipkart", 
                    "link": "https://www.flipkart.com/search?q=PRODUCT_NAME",
                    "image": "/.com/image_upload/fertilizer.png",
                    "why_this_product": "Brief explanation of why this specific product helps this specific disease."
                }
            ]
        }
        
        IMPORTANT:
        1. RECOMMENDATIONS MUST BE SPECIFIC. Do NOT default to "Neem Oil" unless it is actually the best treatment for the specific pest/disease (e.g. aphids). For fungal issues, suggest fungicides. For nutrient deficiency, suggest specific fertilizers.
        2. For the "link" field in supplements, construct a valid Flipkart search URL using the product name.
        3. For the "price" field, provide a realistic estimate in Indian Rupees (INR) as a number only.
        4. Provide 2-3 distinct options if possible (e.g. organic vs chemical).

        Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: base64Image
                                }
                            }
                        ]
                    }
                ],
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.5, // Lower temperature for more deterministic JSON
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false // Disable streaming for simpler JSON parsing
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const responseContent = data.choices[0]?.message?.content;

        console.log("Raw Analysis Response:", responseContent);

        const jsonString = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Analysis Error:", error);

        let errorMessage = error.message || error;

        if (errorMessage.includes("401")) {
            errorMessage = "Unauthorized. Please check your API Key.";
        }

        throw new Error(`Failed to analyze image: ${errorMessage}`);
    }
};

/**
 * Searches for plant problems based on a text description using Groq.
 * @param {string} query 
 * @returns {Promise<Object>}
 */
export const searchPlantProblemWithOpenRouter = async (query) => {
    if (!API_KEY) {
        throw new Error("Missing API Key.");
    }

    try {
        console.log("Starting text search for:", query);
        const prompt = `
        A user is asking about a plant problem: "${query}".
        
        Provide a diagnosis and solution based on this description.
        If the query is too vague, make a best guess or provide general advice for the symptoms described.

        Return the result strictly as a valid JSON object with this structure:
        {
            "plantName": "Inferred Plant Name (or 'Unknown')",
            "diseaseName": "Diagnosed Issue",
            "description": "Description of the problem and why it happens",
            "recoveryTime": "Estimated recovery time",
            "fastRecoveryTips": ["Tip 1", "Tip 2", "Tip 3"],
            "image": "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=600", 
            "supplements": [
                {
                    "name": "Recommended Product Name",
                    "price": "Estimated Price in INR (just the number, e.g. 450)",
                    "link": "https://www.flipkart.com/search?q=PRODUCT_NAME_HERE",
                    "image": "/.com/image_upload/fertilizer.png",
                    "why_this_product": "Brief explanation of why this specific product helps this specific disease."
                }
            ]
        }
        
        IMPORTANT: 
        1. For the "link" field, construct a valid Flipkart search URL using the recommended product name.
        2. For the "price" field, provide a realistic estimate in Indian Rupees (INR) as a number only.
        3. Provide at least 2-3 different supplement options if applicable (e.g. a fungicide and a fertilizer).
        
        Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                temperature: 0.7,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const responseContent = data.choices[0]?.message?.content;

        console.log("Raw Search Response:", responseContent);

        const jsonString = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Search Error:", error);
        throw new Error(`Failed to search: ${error.message || error}`);
    }
};

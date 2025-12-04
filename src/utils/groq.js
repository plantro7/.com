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
                const maxDim = 2048; // Increased to 2K resolution for maximum detail

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

                // Compress to JPEG with 0.95 quality (Very High Quality)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.95);
                resolve(compressedBase64);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Robustly extracts the first JSON object from a string using brace counting.
 * @param {string} text 
 * @returns {string} The extracted JSON string
 */
function extractJSON(text) {
    let startIndex = text.indexOf('{');
    if (startIndex === -1) return null;

    let braceCount = 0;
    let endIndex = -1;

    for (let i = startIndex; i < text.length; i++) {
        if (text[i] === '{') {
            braceCount++;
        } else if (text[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = i;
                break;
            }
        }
    }

    if (endIndex !== -1) {
        return text.substring(startIndex, endIndex + 1);
    }

    return null;
}

/**
 * Analyzes a plant image using Groq API (Llama 4 Scout).
 * @param {File} imageFile 
 * @param {string} language - 'en' or 'bn'
 * @returns {Promise<Object>}
 */
export const analyzeImageWithGroq = async (imageFile, language = 'en') => {
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
        Analyze this high-resolution image of a plant with EXHAUSTIVE ATTENTION TO DETAIL.
        
        SIMULATE A DEEP SEARCH AND EXPERT CONSULTATION PROCESS:
        
        PHASE 1: VISUAL DATA EXTRACTION (Internal Monologue)
        - Scan the image at full resolution.
        - List EVERY visible feature: leaf texture, vein patterns, discoloration spots (size, color, halo), stem condition, soil type.
        - If the image is blurry, acknowledge it but try to extract maximum detail.
        
        PHASE 2: SPECIES VERIFICATION
        - Compare observed features against known plant species.
        - CONFIRM the plant identity (e.g., "This is definitively a Tomato plant due to the serrated leaf margins and glandular trichomes").
        - If the plant is misidentified, the entire diagnosis will be wrong. BE 100% SURE.
        
        PHASE 3: PATHOLOGY ANALYSIS
        - Match symptoms to specific diseases.
        - Differentiate between similar looking issues (e.g., Early Blight vs. Septoria Leaf Spot).
        - Consider nutrient deficiencies and pest damage as alternatives.
        
        PHASE 4: FORMULATE COMPREHENSIVE REPORT
        - Provide a diagnosis that is ACCURATE and DETAILED.
        
        Return the result strictly as a valid JSON object with this structure:
        {
            "name": "Precise Disease Name or 'Healthy'",
            "plantName": "Precise Plant Name",
            "confidence": 0.98,
            "reasoning": "In-depth explanation of the diagnosis. Cite specific visual evidence from the image that supports this conclusion.",
            "description": [
                "Observation 1: Detailed description of lesion shape, color, and distribution.",
                "Observation 2: Analysis of the leaf margins and veins.",
                "Observation 3: Progression of the disease (early/late stage).",
                "Observation 4: Environmental factors likely contributing to this."
            ],
            "treatment": [
                "Immediate: Specific isolation and pruning instructions.",
                "Cultural: Detailed watering and soil management advice.",
                "Chemical: Specific active ingredients to look for (e.g., Chlorothalonil, Copper Octanoate).",
                "Preventive: Long-term strategies to prevent recurrence."
            ],
            "recoveryTime": "Realistic estimate (e.g., '3-4 weeks with consistent treatment')",
            "supplements": [
                { 
                    "name": "Specific Product Name (e.g., Copper Fungicide, NPK 20-20-20)", 
                    "price": "Estimated Price in INR (just the number, e.g. 450)", 
                    "store": "Flipkart", 
                    "link": "https://www.flipkart.com/search?q=PRODUCT_NAME",
                    "why_this_product": "Scientific explanation of why this active ingredient works for this specific disease."
                }
            ]
        }
        
        IMPORTANT:
        1. **ACCURACY IS PARAMOUNT**: Take your time. Do not rush.
        2. **JSON Structure**: You MUST include 'name', 'plantName', and 'confidence' fields.
        3. **Confidence**: Be honest. If the image is unclear, lower the score.
        4. **Tone**: Expert, Scientific, yet Accessible.
        5. **Links**: Valid Flipkart search URLs.
        6. **Price**: Realistic INR estimate.

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
                model: "meta-llama/llama-4-scout-17b-16e-instruct", // Switched to Llama 4 Scout (Alternative Vision Model)
                temperature: 0.2, // Lower temperature for more deterministic/analytical results
                max_completion_tokens: 2048, // Increased token limit for deeper analysis
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

        console.log("Raw Analysis Response:", responseContent);

        // Extract JSON object using robust brace counting
        const jsonString = extractJSON(responseContent);
        if (!jsonString) {
            throw new Error("No valid JSON object found in response");
        }

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Analysis Error:", error);

        let errorMessage = error.message || error;

        if (errorMessage.includes("401")) {
            if (import.meta.env.PROD) {
                errorMessage = "Unauthorized (401). The API Key in GitHub Secrets is invalid or expired. Please check 'VITE_GROQ_API_KEY' in your repository settings.";
            } else {
                errorMessage = "Unauthorized (401). The API Key in your .env file is invalid or expired.";
            }
        }

        throw new Error(`Failed to analyze image: ${errorMessage}`);
    }
};

/**
 * Searches for plant problems based on a text description using Groq.
 * @param {string} query 
 * @param {string} language - 'en' or 'bn'
 * @returns {Promise<Object>}
 */
export const searchPlantProblemWithGroq = async (query, language = 'en') => {
    if (!API_KEY) {
        throw new Error("Missing API Key.");
    }

    try {
        console.log("Starting text search for:", query);
        const prompt = `
        A user is asking about a plant problem: "${query}".
        
        Provide a diagnosis and solution based on this description.
        If the query is too vague, make a best guess or provide general advice for the symptoms described.

        ${language === 'bn' ? 'CRITICAL: PROVIDE ALL TEXT CONTENT (plantName, diseaseName, description, recoveryTime, fastRecoveryTips, supplements details) IN BENGALI LANGUAGE.' : ''}

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

        // Extract JSON object using robust brace counting
        const jsonString = extractJSON(responseContent);
        if (!jsonString) {
            throw new Error("No valid JSON object found in response");
        }

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Search Error:", error);
        throw new Error(`Failed to search: ${error.message || error}`);
    }
};

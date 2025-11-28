const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY; // Fallback for transition
const BASE_URL = "https://openrouter.ai/api/v1";

/**
 * Converts a File object to a base64 string.
 * @param {File} file 
 * @returns {Promise<string>}
 */
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Analyzes a plant image using OpenRouter (defaulting to Gemini Flash 1.5).
 * @param {File} imageFile 
 * @returns {Promise<Object>}
 */
export const analyzeImageWithOpenRouter = async (imageFile) => {
    if (!API_KEY) {
        throw new Error("MISSING_API_KEY: OpenRouter API Key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file (local) or GitHub Secrets (production).");
    }

    try {
        const base64Image = await fileToBase64(imageFile);

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
                    "name": "Supplement Name (e.g., Neem Oil)", 
                    "price": "Estimated Price in INR (just the number, e.g. 450)", 
                    "store": "Flipkart", 
                    "link": "https://www.flipkart.com/search?q=PRODUCT_NAME",
                    "image": "/image_upload/fertilizer.png" 
                }
            ]
        }
        
        IMPORTANT:
        1. For the "link" field in supplements, construct a valid Flipkart search URL using the product name.
        2. For the "price" field, provide a realistic estimate in Indian Rupees (INR) as a number only.

        Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        `;

        const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin, // Optional, for including your app on openrouter.ai rankings.
                "X-Title": "Plant Disease Finder", // Optional. Shows in rankings on openrouter.ai.
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-nano-12b-v2-vl:free",
                extra_body: {
                    reasoning: {
                        enabled: true
                    }
                },
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
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean up markdown if present
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("OpenRouter Analysis Error:", error);
        throw new Error(`Failed to analyze image: ${error.message || error}`);
    }
};

/**
 * Searches for plant problems based on a text description using OpenRouter.
 * @param {string} query 
 * @returns {Promise<Object>}
 */
export const searchPlantProblemWithOpenRouter = async (query) => {
    if (!API_KEY) {
        throw new Error("Missing OpenRouter API Key.");
    }

    try {
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
            "supplement": {
                "name": "Recommended Product Name",
                "price": "Estimated Price in INR (just the number, e.g. 450)",
                "link": "https://www.flipkart.com/search?q=PRODUCT_NAME_HERE",
                "image": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400"
            }
        }
        
        IMPORTANT: 
        1. For the "link" field, construct a valid Flipkart search URL using the recommended product name. Example: "https://www.flipkart.com/search?q=Neem+Oil"
        2. For the "price" field, provide a realistic estimate in Indian Rupees (INR) as a number only.
        3. For the "image" field, use a generic placeholder URL if you can't generate one, or use the one provided in the example.
        
        Do not include markdown formatting like \`\`\`json. Just the raw JSON.
        `;

        const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "Plant Disease Finder",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-lite-preview-02-05:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);

    } catch (error) {
        console.error("OpenRouter Search Error:", error);
        throw new Error(`Failed to search: ${error.message || error}`);
    }
};

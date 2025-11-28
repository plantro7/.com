/**
 * Simulates analyzing a plant image and returning a diagnosis.
 * @param {File} imageFile 
 * @returns {Promise<Object>}
 */
export const analyzeImage = async (imageFile) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const scenarios = [
                {
                    name: "Healthy",
                    plantName: "Monstera Deliciosa",
                    confidence: 0.98,
                    description: [
                        "The plant appears healthy and vibrant.",
                        "No visible signs of pests or diseases.",
                        "Leaves are a rich green color."
                    ],
                    recoveryTime: "N/A",
                    treatment: ["Continue regular watering.", "Ensure adequate indirect sunlight.", "Wipe leaves to remove dust."],
                    supplements: [
                        {
                            name: "Organic Fertilizer",
                            image: "/image_upload/fertilizer.png",
                            price: "$12-18",
                            store: "Green Thumb Nursery"
                        }
                    ]
                },
                {
                    name: "Leaf Spot",
                    plantName: "Ficus Elastica",
                    confidence: 0.92,
                    description: [
                        "Brown or black spots on leaves.",
                        "Yellow halos around spots.",
                        "Caused by fungal or bacterial infection."
                    ],
                    recoveryTime: "2-3 weeks",
                    treatment: ["Remove infected leaves immediately.", "Avoid overhead watering to keep foliage dry.", "Apply copper-based fungicide if severe."],
                    supplements: [
                        {
                            name: "Copper Fungicide",
                            image: "/image_upload/fungicide.png",
                            price: "$15-25",
                            store: "Garden Center"
                        }
                    ]
                },
                {
                    name: "Powdery Mildew",
                    plantName: "Rosa (Rose)",
                    confidence: 0.95,
                    description: [
                        "White, powdery fungal growth on leaves.",
                        "Leaves may curl or turn yellow.",
                        "Common in humid conditions."
                    ],
                    recoveryTime: "1-2 weeks",
                    treatment: ["Improve air circulation around the plant.", "Prune affected areas.", "Apply neem oil or sulfur fungicide."],
                    supplements: [
                        {
                            name: "Neem Oil",
                            image: "/image_upload/neem_oil.png",
                            price: "$10-15",
                            store: "Organic Supply"
                        }
                    ]
                }
            ];

            // Randomly select a scenario to simulate AI "thinking"
            const randomResult = scenarios[Math.floor(Math.random() * scenarios.length)];
            resolve(randomResult);
        }, 2000); // 2 second delay for realism
    });
};

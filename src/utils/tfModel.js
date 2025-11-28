import { analyzeImage as mockAnalyzeImage } from './mockML';

export const loadModel = async () => {
    console.log("Mock model loaded (Real model deleted)");
    return { model: null, classifier: null, featureExtractor: null };
};

export const addExample = async (imageElement, classId) => {
    console.log("Mock addExample called - doing nothing");
    return 0;
};

export const analyzeImage = async (imageElement) => {
    console.log("Using Mock AI for analysis");
    return await mockAnalyzeImage(imageElement);
};


import React, { useState } from 'react';
import { Search, Camera, Upload, ArrowRight, ShoppingCart, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import { analyzeImageWithOpenRouter, searchPlantProblemWithOpenRouter } from '../utils/openrouter';

// Mock data for solutions
const MOCK_SOLUTIONS = {
    "Leaf Spot": {
        plantName: "Monstera Deliciosa",
        diseaseName: "Bacterial Leaf Spot",
        image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=600",
        description: "Bacterial leaf spot causes dark, water-soaked spots on leaves that often have a yellow halo. It spreads quickly in humid conditions and can cause significant leaf loss if not treated.",
        recoveryTime: "14-21 Days",
        fastRecoveryTips: [
            "Isolate the plant immediately to prevent spread.",
            "Remove all infected leaves with sterilized scissors.",
            "Avoid overhead watering; keep foliage dry.",
            "Improve air circulation around the plant."
        ],
        supplement: {
            name: "Copper Fungicide",
            image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400",
            price: 450,
            link: "https://www.flipkart.com/search?q=copper+fungicide+for+plants"
        }
    },
    "Yellowing": {
        plantName: "Snake Plant",
        diseaseName: "Root Rot (Overwatering)",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
        description: "Yellowing leaves, especially at the base, often indicate root rot caused by overwatering. The roots become mushy and cannot absorb nutrients.",
        recoveryTime: "30-45 Days",
        fastRecoveryTips: [
            "Stop watering immediately.",
            "Remove the plant from its pot and trim mushy roots.",
            "Repot in fresh, dry, well-draining soil.",
            "Ensure the pot has drainage holes."
        ],
        supplement: {
            name: "Perlite & Potting Mix",
            image: "https://images.unsplash.com/photo-1599598425947-736d96a60338?auto=format&fit=crop&q=80&w=400",
            price: 299,
            link: "https://www.flipkart.com/search?q=perlite+potting+mix"
        }
    }
};

const PlantProblems = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'search'
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [solution, setSolution] = useState(null);

    const handleImageSelect = async (file, previewUrl) => {
        setSelectedImage(file);
        setIsAnalyzing(true);
        setSolution(null);

        try {
            const result = await analyzeImageWithOpenRouter(file);

            if (result.isUnknown) {
                alert("Could not identify a plant in this image. Please try again.");
                setIsAnalyzing(false);
                return;
            }

            // Map API result to component state structure
            const mappedSolution = {
                plantName: result.plantName || "Unknown Plant",
                diseaseName: result.name || "Unknown Issue",
                image: previewUrl,
                description: result.description || result.reasoning || "No description available.",
                recoveryTime: result.recoveryTime || "Varies",
                fastRecoveryTips: Array.isArray(result.treatment)
                    ? result.treatment
                    : (result.treatment ? [result.treatment] : ["Consult a local nursery."]),
                supplement: (result.supplements && result.supplements.length > 0)
                    ? result.supplements[0]
                    : {
                        name: "General Plant Food",
                        image: "https://images.unsplash.com/photo-1599598425947-736d96a60338?auto=format&fit=crop&q=80&w=400",
                        price: "299",
                        link: "https://www.flipkart.com/search?q=plant+fertilizer"
                    }
            };

            setSolution(mappedSolution);
        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Failed to analyze image. Please check your connection and API key.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsAnalyzing(true); // Reuse analyzing state for loading
        setSolution(null);

        try {
            const result = await searchPlantProblemWithOpenRouter(searchQuery);
            setSolution(result);
        } catch (error) {
            console.error("Search failed:", error);
            alert("Failed to search. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-8 pb-24">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-brand-dark mb-4">Diagnose & Fix Plant Problems</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Use our AI-powered scanner or search database to find immediate solutions for your plant's health issues.
                    </p>
                </div>

                {/* Toggle Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-mint-50 p-1 rounded-full inline-flex">
                        <button
                            onClick={() => { setActiveTab('scan'); setSolution(null); }}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'scan'
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'text-slate-600 hover:text-brand-primary'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Scan Plant
                            </div>
                        </button>
                        <button
                            onClick={() => { setActiveTab('search'); setSolution(null); }}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'search'
                                ? 'bg-brand-primary text-white shadow-md'
                                : 'text-slate-600 hover:text-brand-primary'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                AI Search
                            </div>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-4xl mx-auto">

                    {/* Scan Mode */}
                    {activeTab === 'scan' && !solution && (
                        <div className="bg-white rounded-3xl shadow-xl shadow-mint-100 p-8 border border-mint-50 text-center">
                            <h2 className="text-2xl font-bold text-brand-dark mb-8">Upload a photo of the affected area</h2>
                            <div className="max-w-md mx-auto">
                                <ImageUploader onImageSelect={handleImageSelect} />
                            </div>
                            {isAnalyzing && (
                                <div className="mt-8 flex flex-col items-center animate-pulse">
                                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <p className="text-brand-primary font-bold">Analyzing plant health...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Mode */}
                    {activeTab === 'search' && !solution && (
                        <div className="bg-white rounded-3xl shadow-xl shadow-mint-100 p-8 border border-mint-50">
                            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                                <input
                                    type="text"
                                    placeholder="Describe the problem (e.g., 'yellow leaves', 'brown spots')..."
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-mint-100 focus:border-brand-primary focus:outline-none text-lg shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                                <Button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-brand-primary hover:bg-mint-600 text-white px-6 py-2 rounded-xl font-bold"
                                >
                                    Search
                                </Button>
                            </form>

                            <div className="mt-12">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-brand-primary font-bold">Searching AI database...</p>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Common Searches</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {['Yellow Leaves', 'Brown Spots', 'Drooping', 'White Powder', 'Insects'].map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => { setSearchQuery(tag); handleSearch({ preventDefault: () => { } }); }}
                                                    className="px-4 py-2 bg-slate-50 hover:bg-mint-50 text-slate-600 hover:text-brand-primary rounded-lg text-sm font-semibold transition-colors border border-slate-100"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Solution View */}
                    {solution && (
                        <div className="animate-fade-in space-y-8">
                            {/* 1. Disease Image & Basic Info */}
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                                <div className="grid md:grid-cols-2">
                                    <div className="h-64 md:h-auto relative">
                                        <img
                                            src={solution.image}
                                            alt={solution.diseaseName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> Detected
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <div className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-2">
                                            {solution.plantName}
                                        </div>
                                        <h2 className="text-3xl font-bold text-brand-dark mb-4">{solution.diseaseName}</h2>
                                        <p className="text-slate-600 leading-relaxed">
                                            {solution.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* 2. Recovery Info */}
                                <div className="md:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                                    <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-brand-primary" />
                                        Recovery Plan
                                    </h3>

                                    <div className="mb-8 flex items-center gap-4 bg-mint-50 p-4 rounded-xl">
                                        <div className="text-brand-primary font-bold text-lg">Estimated Time:</div>
                                        <div className="text-brand-dark font-bold text-2xl">{solution.recoveryTime}</div>
                                    </div>

                                    <h4 className="font-bold text-slate-700 mb-4">Fast Recovery Tips:</h4>
                                    <ul className="space-y-3">
                                        {solution.fastRecoveryTips.map((tip, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                                <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 3. Recommended Supplement */}
                                <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-brand-primary/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                        Recommended
                                    </div>

                                    <h3 className="text-lg font-bold text-brand-dark mb-4">Treatment Product</h3>

                                    <div className="rounded-xl overflow-hidden mb-4 h-40 bg-slate-100">
                                        <img
                                            src={solution.supplement.image}
                                            alt={solution.supplement.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <h4 className="font-bold text-brand-dark mb-1">{solution.supplement.name}</h4>
                                    <div className="text-brand-primary font-bold text-xl mb-4">₹{solution.supplement.price}</div>

                                    <a
                                        href={solution.supplement.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full bg-brand-primary hover:bg-mint-600 text-white rounded-xl py-3 font-bold shadow-md flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-4 h-4" />
                                            Buy on Flipkart
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => setSolution(null)}
                                    className="text-slate-500 hover:text-brand-primary font-semibold flex items-center gap-2 transition-colors"
                                >
                                    Start New Diagnosis <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantProblems;

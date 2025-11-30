import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const BASE_URL = import.meta.env.BASE_URL;

const plants = [
    {
        category: "Common Houseplants",
        items: [
            { name: "Monstera Deliciosa", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=400", description: "Known for its large, perforated leaves." },
            { name: "Snake Plant", image: `${BASE_URL}image_upload/Gemini_Generated_Image_hsua2shsua2shsua.png`, description: "Hardy and low-light tolerant." },
            { name: "Fiddle Leaf Fig", image: `${BASE_URL}image_upload/fiddle_leaf_fig.png`, description: "Popular for its large, violin-shaped leaves." },
            { name: "Pothos", image: `${BASE_URL}image_upload/pothos.png`, description: "Fast-growing trailing vine." }
        ]
    },
    {
        category: "Fruits & Vegetables",
        items: [
            { name: "Tomato", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400", description: "Prone to blight and rot." },
            { name: "Strawberry", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=400", description: "Sweet red fruit, susceptible to mold." },
            { name: "Lemon Tree", image: "https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?auto=format&fit=crop&q=80&w=400", description: "Citrus fruit, needs plenty of sun." },
            { name: "Chili Pepper", image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=400", description: "Spicy fruit, watch for aphids." }
        ]
    },
    {
        category: "Common Diseases",
        items: [
            { name: "Leaf Spot", image: `${BASE_URL}image_upload/shot_hole_disease.png`, description: "Brown or black spots on foliage." },
            { name: "Powdery Mildew", image: `${BASE_URL}image_upload/powdery_mildew.png`, description: "White fungal growth on leaves." },
            { name: "Root Rot", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400", description: "Decay of roots due to overwatering." },
            { name: "Aphids", image: "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=400", description: "Small sap-sucking insects." }
        ]
    }
];

const PlantIdentifier = () => {
    const { t } = useLanguage();

    const getCategoryTitle = (category) => {
        if (category === "Common Houseplants") return t('commonHouseplants');
        if (category === "Fruits & Vegetables") return t('fruitsVegetables');
        if (category === "Common Diseases") return t('commonDiseases');
        return category;
    };

    return (
        <div className="min-h-screen bg-white pt-8 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-brand-dark mb-4">{t('identifierTitle')}</h1>
                <p className="text-slate-600 mb-12 max-w-2xl">
                    {t('identifierDesc')}
                </p>

                <div className="space-y-16">
                    {plants.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold text-brand-primary mb-6 border-b border-mint-100 pb-2">
                                {getCategoryTitle(category.category)}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlantIdentifier;

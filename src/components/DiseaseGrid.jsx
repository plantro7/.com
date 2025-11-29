import React from 'react';

const diseases = [
    {
        name: "Shot Hole Disease",
        description: "The disease's name couldn't be more evident because it is about the holes...",
        image: "image_upload/shot_hole_disease.png"
    },
    {
        name: "Peach Leaf Curl",
        description: "The fungus Taphrina Deformans causes this plant's disease...",
        image: "image_upload/peach_leaf_curl.png"
    },
    {
        name: "Nutrient excess",
        description: "The most common issues for plants are nutrient-related...",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Mechanical damage",
        description: "Mechanical damage is a physical violation of the integrity of the plant...",
        image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&q=80&w=400"
    },
    {
        name: "Chilling and Frost Injury",
        description: "Frost damage occurs if the plant stays in unacceptably low-temperature...",
        image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=400"
    }
];

const DiseaseGrid = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-brand-dark mb-2">What Are Common Plant Diseases?</h2>
                <a href="#" className="text-brand-primary font-semibold hover:underline mb-8 inline-block">More info</a>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {diseases.map((disease, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="rounded-2xl overflow-hidden mb-4 h-48">
                                <img
                                    src={disease.image}
                                    alt={disease.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                {disease.name}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                {disease.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DiseaseGrid;

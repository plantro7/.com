import React from 'react';
import { ShoppingCart, Clock, IndianRupee } from 'lucide-react';
import Button from '../components/Button';

const supplements = [
    {
        id: 1,
        name: "Organic Neem Oil",
        image: "image_upload/Gemini_Generated_Image_tlm6zttlm6zttlm6.png",
        description: "Natural pesticide for all types of plants. Controls aphids, whiteflies, and spider mites.",
        recoveryTime: "3-5 Days",
        price: 299,
        link: "https://www.flipkart.com/search?q=neem+oil+for+plants"
    },
    {
        id: 2,
        name: "Seaweed Liquid Fertilizer",
        image: "image_upload/fertilizer.png",
        description: "Boosts growth and stress resistance. Rich in micronutrients and hormones.",
        recoveryTime: "7-10 Days",
        price: 450,
        link: "https://www.flipkart.com/search?q=seaweed+fertilizer"
    },
    {
        id: 3,
        name: "Epsom Salt (Magnesium Sulfate)",
        image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&q=80&w=400",
        description: "Fixes yellowing leaves and improves nutrient absorption. Great for tomatoes and roses.",
        recoveryTime: "5-7 Days",
        price: 150,
        link: "https://www.flipkart.com/search?q=epsom+salt+for+plants"
    },
    {
        id: 4,
        name: "Vermicompost",
        image: "image_upload/Gemini_Generated_Image_n1rb5vn1rb5vn1rb.png",
        description: "Organic manure rich in nutrients. Improves soil structure and water retention.",
        recoveryTime: "10-14 Days",
        price: 399,
        link: "https://www.flipkart.com/search?q=vermicompost"
    },
    {
        id: 5,
        name: "Bone Meal Powder",
        image: "image_upload/Gemini_Generated_Image_2ravsq2ravsq2rav.png",
        description: "Slow-release phosphorus source. Promotes strong root development and flowering.",
        recoveryTime: "15-20 Days",
        price: 350,
        link: "https://www.flipkart.com/search?q=bone+meal+fertilizer"
    },
    {
        id: 6,
        name: "NPK 19:19:19",
        image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400",
        description: "Balanced water-soluble fertilizer for overall plant growth and health.",
        recoveryTime: "5-7 Days",
        price: 250,
        link: "https://www.flipkart.com/search?q=npk+19+19+19"
    },
    {
        id: 7,
        name: "Mustard Cake Powder",
        image: "image_upload/Gemini_Generated_Image_7jr4t97jr4t97jr4.png",
        description: "Traditional organic fertilizer. High in nitrogen and prevents soil-borne diseases.",
        recoveryTime: "10-15 Days",
        price: 199,
        link: "https://www.flipkart.com/search?q=mustard+cake+fertilizer"
    },
    {
        id: 8,
        name: "Perlite",
        image: "image_upload/Gemini_Generated_Image_l2lvz0l2lvz0l2lv.png",
        description: "Improves drainage and aeration in potting mix. Prevents root rot.",
        recoveryTime: "Immediate",
        price: 299,
        link: "https://www.flipkart.com/search?q=perlite+for+plants"
    },
    {
        id: 9,
        name: "Cocopeat Block",
        image: "image_upload/Gemini_Generated_Image_kectjkectjkectjk.png",
        description: "Excellent medium for seed germination. Retains moisture and improves soil texture.",
        recoveryTime: "Immediate",
        price: 199,
        link: "https://www.flipkart.com/search?q=cocopeat+block"
    },
    {
        id: 10,
        name: "Fungicide Powder",
        image: "image_upload/fungicide.png",
        description: "Treats root rot, leaf spot, and mildew. Systemic action for long-lasting protection.",
        recoveryTime: "3-7 Days",
        price: 180,
        link: "https://www.flipkart.com/search?q=plant+fungicide"
    },
    {
        id: 11,
        name: "Rooting Hormone",
        image: "image_upload/Gemini_Generated_Image_p94ki2p94ki2p94k.png",
        description: "Stimulates root growth in cuttings. Increases propagation success rate.",
        recoveryTime: "10-14 Days",
        price: 220,
        link: "https://www.flipkart.com/search?q=rooting+hormone+powder"
    },
    {
        id: 12,
        name: "Micronutrient Mixture",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
        description: "Corrects deficiencies of Zinc, Iron, Boron, etc. Restores green color to leaves.",
        recoveryTime: "7-10 Days",
        price: 350,
        link: "https://www.flipkart.com/search?q=micronutrient+mixture+for+plants"
    },
    {
        id: 13,
        name: "Sticky Traps (Yellow/Blue)",
        image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=400",
        description: "Traps flying insects like whiteflies and aphids. Non-toxic pest control.",
        recoveryTime: "Immediate",
        price: 299,
        link: "https://www.flipkart.com/search?q=sticky+traps+for+plants"
    },
    {
        id: 14,
        name: "Garden Tool Set",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400",
        description: "Essential tools: Trowel, Pruner, Rake. Durable and rust-resistant.",
        recoveryTime: "N/A",
        price: 599,
        link: "https://www.flipkart.com/search?q=garden+tool+set"
    },
    {
        id: 15,
        name: "Plant Growth Promoter",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=400",
        description: "Enhances photosynthesis and yield. Suitable for vegetables and flowers.",
        recoveryTime: "5-10 Days",
        price: 499,
        link: "https://www.flipkart.com/search?q=plant+growth+promoter"
    }
];

const Supplements = () => {
    return (
        <div className="min-h-screen bg-white pt-8 pb-24">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-brand-dark mb-4">Plant Supplements & Care</h1>
                <p className="text-slate-600 mb-12 max-w-2xl">
                    Give your plants the boost they need with our curated selection of fertilizers, pest control, and care products.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {supplements.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full group">
                            <div className="h-56 overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-primary shadow-sm">
                                    ₹{item.price}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                                    {item.name}
                                </h3>

                                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-6 bg-mint-50 p-2 rounded-lg w-fit">
                                    <Clock className="w-4 h-4 text-brand-primary" />
                                    <span>Recover: <span className="font-semibold">{item.recoveryTime}</span></span>
                                </div>

                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full bg-brand-primary hover:bg-mint-600 text-white rounded-xl py-3 font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Buy on Flipkart
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Supplements;

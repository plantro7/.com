import React from 'react';
import { Camera } from 'lucide-react';
import Button from './Button';

const FloatingBanner = ({ onDiagnose }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-mint-100 border-t border-mint-200 p-4 z-40 animate-slide-up">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-brand-dark">
                        Identify, get care & grow healthy plants with ease!
                    </p>
                </div>
                <Button
                    onClick={onDiagnose}
                    className="bg-brand-primary hover:bg-mint-600 text-white rounded-full px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <Camera className="w-5 h-5" />
                    Diagnose a plant
                </Button>
            </div>
        </div>
    );
};

export default FloatingBanner;

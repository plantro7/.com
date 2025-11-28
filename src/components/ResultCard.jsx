import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, Clock, MapPin, Star } from 'lucide-react';
import Button from './Button';

const ResultCard = ({ result, onReset }) => {
    if (!result) return null;

    const getStatusColor = (name) => {
        if (name === 'Healthy') return 'text-green-600 bg-green-50 border-green-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    const getIcon = (name) => {
        if (name === 'Healthy') return CheckCircle;
        return AlertTriangle;
    };

    const StatusIcon = getIcon(result.name);
    const statusClasses = getStatusColor(result.name);

    const [feedback, setFeedback] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [submitted, setSubmitted] = React.useState(false);

    const getSupplementImage = (name) => {
        const normalizedName = name.toLowerCase();
        if (normalizedName.includes('neem')) return '/image_upload/neem_oil.png';
        if (normalizedName.includes('fungicide')) return '/image_upload/fungicide.png';
        if (normalizedName.includes('potassium bicarbonate')) return '/image_upload/potassium_bicarbonate.png';
        if (normalizedName.includes('calcium nitrate')) return '/image_upload/calcium_nitrate.png';
        if (normalizedName.includes('fertilizer')) return '/image_upload/fertilizer.png';
        return '/image_upload/fertilizer.png'; // Default fallback
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send data to a backend
    };

    if (result.isUnknown) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center p-12">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Not a Plant Detected</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
                    We could not identify a plant or fruit in this image. Please upload a clear photo of a plant, leaf, or fruit to get a diagnosis.
                </p>
                <Button onClick={onReset} size="xl" className="px-8 bg-brand-primary hover:bg-mint-600 text-white rounded-full font-bold shadow-lg">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className={`p-8 border-b ${statusClasses} flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-white rounded-2xl shadow-sm">
                        <StatusIcon className="w-10 h-10" />
                    </div>
                    <div>
                        <div className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1">Diagnosis Result</div>
                        <h2 className="text-3xl font-extrabold mb-1">{result.name}</h2>
                        <p className="font-medium text-lg opacity-90">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
                    </div>
                </div>
                <div className="bg-white/60 px-6 py-3 rounded-xl backdrop-blur-sm">
                    <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Identified Plant</div>
                    <div className="text-xl font-bold text-slate-800">{result.plantName || "Unknown Plant"}</div>
                </div>
            </div>

            <div className="p-8 md:p-10 space-y-10">
                {/* Reasoning Section */}
                {result.reasoning && (
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-10">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <Star className="w-6 h-6 mr-2 text-blue-500" />
                            AI Reasoning
                        </h3>
                        <p className="text-slate-700 leading-relaxed italic">
                            "{result.reasoning}"
                        </p>
                    </div>
                )}

                {/* Analysis Section */}
                <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <Info className="w-6 h-6 mr-2 text-brand-primary" />
                            Analysis & Symptoms
                        </h3>
                        <ul className="space-y-3">
                            {Array.isArray(result.description) ? (
                                result.description.map((point, idx) => (
                                    <li key={idx} className="flex items-start text-slate-600 leading-relaxed">
                                        <span className="mr-3 mt-1.5 w-2 h-2 bg-brand-primary rounded-full flex-shrink-0"></span>
                                        {point}
                                    </li>
                                ))
                            ) : (
                                <p className="text-slate-600 leading-relaxed">{result.description}</p>
                            )}
                        </ul>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Recovery Estimation</h3>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Estimated Time</div>
                                <div className="text-2xl font-bold text-slate-800">{result.recoveryTime || "Varies"}</div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                            Recovery time depends on environmental conditions and consistency of treatment.
                        </p>
                    </div>
                </div>

                {/* Treatment Section */}
                {result.treatment && (
                    <div className="border-t border-slate-100 pt-10">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Effective Treatment</h3>
                        <div className="bg-mint-50/50 rounded-2xl p-8 border border-mint-100">
                            <ul className="space-y-4">
                                {Array.isArray(result.treatment) ? (
                                    result.treatment.map((step, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-mint-200 text-mint-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {idx + 1}
                                            </div>
                                            <span className="text-slate-700 text-lg leading-relaxed">{step}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-slate-700">{result.treatment}</p>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Supplements Section */}
                {result.supplements && result.supplements.length > 0 && (
                    <div className="border-t border-slate-100 pt-10">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Recommended Supplements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {result.supplements.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-brand-primary/30 hover:shadow-md transition-all bg-white group cursor-pointer"
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                        <img src={getSupplementImage(item.name)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-brand-primary transition-colors">{item.name}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-brand-primary font-bold">₹{item.price.toString().replace(/[^\d]/g, '')}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Buy on Flipkart
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback Section */}
                <div className="border-t border-slate-100 pt-10">
                    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>

                        {!submitted ? (
                            <form onSubmit={handleFeedbackSubmit} className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Was this diagnosis helpful?</h3>
                                <p className="text-slate-400 mb-6 text-sm">Your feedback helps us improve our accuracy.</p>

                                <div className="flex gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`p-1 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-500'}`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary mb-4 h-24 resize-none"
                                ></textarea>

                                <button
                                    type="submit"
                                    disabled={rating === 0}
                                    className="bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                                >
                                    Submit Feedback
                                </button>
                            </form>
                        ) : (
                            <div className="relative z-10 text-center py-8 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                                <p className="text-slate-400">Your feedback has been recorded successfully.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-center">
                    <Button onClick={onReset} variant="secondary" size="lg" className="px-8">
                        Analyze Another Plant
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;

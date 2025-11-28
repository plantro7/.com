import React, { useState, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import Button from './components/Button';
import ImageCarousel from './components/ImageCarousel';
import DiseaseGrid from './components/DiseaseGrid';
import FloatingBanner from './components/FloatingBanner';
import Footer from './components/Footer';
import PlantIdentifier from './pages/PlantIdentifier';
import Supplements from './pages/Supplements';
import PlantProblems from './pages/PlantProblems';


import { analyzeImageWithOpenRouter } from './utils/openrouter';
import { Camera } from 'lucide-react';

import { useLanguage, LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const uploadSectionRef = useRef(null);
  const { t } = useLanguage();
  const { currentUser, login } = useAuth();

  const handleImageSelect = (file, previewUrl) => {
    setImage(file);
    setPreview(previewUrl);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      // Use OpenRouter AI
      const analysisResult = await analyzeImageWithOpenRouter(image);
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-mint-50 to-white pt-12 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary/80 uppercase tracking-wider">
              <span>Plantro</span> &gt; <span>{t('plantProblems')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-dark leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              {t('heroDesc')}
            </p>

            <Button
              size="xl"
              onClick={scrollToUpload}
              className="bg-brand-primary hover:bg-mint-600 text-white rounded-full px-8 py-4 font-bold shadow-xl hover:shadow-2xl hover:shadow-mint-200 transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              {t('diagnoseBtn')}
            </Button>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-mint-100 rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <ImageCarousel />
            </div>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {/* Upload Section */}
        <div ref={uploadSectionRef} className="container mx-auto px-4 -mt-12 relative z-20 mb-24">
          <div className="bg-white rounded-3xl shadow-2xl shadow-mint-100 p-8 md:p-12 border border-mint-50">
            {!image && !result && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">{t('startDiagnosis')}</h2>
                <p className="text-slate-500">{t('uploadText')}</p>
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="flex flex-col items-center space-y-8">

              {!result && (
                <div className="w-full flex flex-col items-center space-y-8">
                  <ImageUploader onImageSelect={handleImageSelect} />

                  {image && (
                    <div className="animate-in fade-in zoom-in duration-300 flex gap-4">
                      <Button
                        size="xl"
                        onClick={handleAnalyze}
                        isLoading={isAnalyzing}
                        className="bg-brand-primary hover:bg-mint-600 text-white rounded-full px-10 py-4 font-bold shadow-xl hover:shadow-2xl hover:shadow-mint-200"
                      >
                        {isAnalyzing ? t('analyzing') : t('startAnalysis')}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {result && (
                <ResultCard result={result} onReset={handleReset} />
              )}
            </div>
          </div>
        </div>

        {/* Disease Grid Section */}
        <DiseaseGrid />
      </main>


    </>
  );
}



function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-brand-dark selection:bg-mint-100 selection:text-brand-primary">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/identifier" element={<PlantIdentifier />} />
              <Route path="/supplements" element={<Supplements />} />
              <Route path="/problems" element={<PlantProblems />} />

            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

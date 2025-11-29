import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

const ImageUploader = ({ onImageSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const inputRef = useRef(null);
    const streamRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onImageSelect(file, reader.result);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        onImageSelect(null, null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;
            setIsCameraOpen(true);
            // Wait for state update and render
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have granted permission.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            handleFile(file);
            stopCamera();
        }, 'image/jpeg', 0.8);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!preview ? (
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${dragActive
                        ? "border-green-500 bg-green-50 scale-[1.02]"
                        : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-slate-100"
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {isCameraOpen ? (
                        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 flex gap-4">
                                <Button
                                    onClick={captureImage}
                                    className="bg-white text-black hover:bg-slate-200"
                                    icon={Camera}
                                >
                                    Capture
                                </Button>
                                <Button
                                    onClick={stopCamera}
                                    variant="secondary"
                                    className="bg-black/50 text-white hover:bg-black/70 border-none"
                                    icon={X}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChange}
                            />

                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <Upload className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800">Upload Plant Image</h3>
                                    <p className="text-slate-500 mt-1">Drag & drop or click to select</p>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button
                                        onClick={() => inputRef.current?.click()}
                                        icon={ImageIcon}
                                    >
                                        Select File
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        icon={Camera}
                                        onClick={startCamera}
                                    >
                                        Use Camera
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-900 group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

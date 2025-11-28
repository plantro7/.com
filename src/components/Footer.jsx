import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Leaf
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-white font-bold text-2xl">
                            <div className="bg-brand-primary p-1 rounded-lg">
                                <img src="/logo.jpg" alt="Plantro Logo" className="w-8 h-8 object-cover rounded-md" />
                            </div>
                            <span>Plantro</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Empowering plant lovers with advanced AI technology to diagnose, treat, and prevent plant diseases. Let's make your garden thrive.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/identifier" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                    Plant Identifier
                                </Link>
                            </li>
                            <li>
                                <Link to="/supplements" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                    Supplements
                                </Link>
                            </li>
                            <li>
                                <Link to="/problems" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                    Common Problems
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Our Services
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                Disease Diagnosis
                            </li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                Plant Care Guides
                            </li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                Expert Consultation
                            </li>
                            <li className="hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                                Community Support
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-brand-primary rounded-full"></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg mt-1">
                                    <MapPin className="w-5 h-5 text-brand-primary" />
                                </div>
                                <span>123 Green Street, Botanical Garden District, NY 10001, USA</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg">
                                    <Phone className="w-5 h-5 text-brand-primary" />
                                </div>
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="bg-slate-800 p-2 rounded-lg">
                                    <Mail className="w-5 h-5 text-brand-primary" />
                                </div>
                                <span>support@plantro.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© 2025 Plantro. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

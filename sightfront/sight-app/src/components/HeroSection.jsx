import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, BarChart2, Zap, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroSection = () => {
    const [currentWord, setCurrentWord] = useState(0);
    const words = ["Sales", "Revenue", "Demand", "Growth", "Trends"];
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 text-gray-900 dark:text-white transition-colors duration-300">
            
            <div className="absolute inset-0 overflow-hidden opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full bg-indigo-400 dark:bg-indigo-500"
                        style={{
                            width: Math.random() * 300 + 50,
                            height: Math.random() * 300 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: 'blur(80px)',
                            opacity: 0.3
                        }}
                    />
                ))}
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
                <div className="max-w-4xl mx-auto text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600/10 dark:bg-indigo-600/30 border border-indigo-400/20 dark:border-indigo-500/30 mb-6"
                    >
                        <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-100">
                            Powered by AI Forecasting Models
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                    >
                        Predict Your <br className="hidden sm:block" />
                        <span className="relative inline-block">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 dark:from-cyan-400 dark:to-indigo-400">
                                {words[currentWord]}
                            </span>
                            <motion.span
                                key={currentWord}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 dark:from-cyan-400 dark:to-indigo-400"
                            >
                                {words[currentWord]}
                            </motion.span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Transform your business with AI-powered forecasting that learns from your data. 
                        <span className="hidden sm:inline"> Get actionable insights in minutes, not days.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
                    >
                        <Link
                            to="/login"
                            className="relative group flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </Link>
                        <Link
                            to="/demo"
                            className="relative group flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 dark:bg-white/20 font-medium hover:bg-white/20 border border-white/20 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center">
                                <CloudLightning className="mr-2 h-4 w-4" /> Live Demo
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
                    >
                        <div className="bg-white/10 dark:bg-white/5 p-4 rounded-xl border border-white/20">
                            <div className="text-2xl sm:text-3xl font-bold text-cyan-500">99.7%</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                        </div>
                        <div className="bg-white/10 dark:bg-white/5 p-4 rounded-xl border border-white/20">
                            <div className="text-2xl sm:text-3xl font-bold text-indigo-500">24/7</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Real-time</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-white/10 dark:bg-white/5 p-4 rounded-xl border border-white/20">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-500">10x</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Faster Insights</div>
                        </div>
                    </motion.div>

                    <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-10 top-1/4 opacity-40"
                    >
                        <BarChart2 className="h-16 w-16 text-cyan-400" />
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute right-16 top-1/3 opacity-40"
                    >
                        <TrendingUp className="h-20 w-20 text-purple-400" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;

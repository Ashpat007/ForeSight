import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  BarChartHorizontalBig, 
  Zap, 
  ShieldCheck, 
  Database, 
  LineChart 
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
    const { featureId } = useParams();

    const featuresData = {
        predictions: {
            title: "AI Predictions",
            description: "Harness the power of machine learning to predict future demand with up to 99% accuracy. Our models adapt to your unique business seasonal patterns and market trends.",
            icon: <BrainCircuit className="w-12 h-12 text-indigo-500" />,
            benefits: ["Identify seasonal trends", "Predict stockout risks", "Improve cash flow forecasting"]
        },
        realtime: {
            title: "Real-time Data",
            description: "Connect your live data sources for instant updates. Watch your forecasts evolve as new sales data flows into the system, ensuring you're always one step ahead.",
            icon: <Zap className="w-12 h-12 text-amber-500" />,
            benefits: ["Instant data synchronization", "Live dashboard updates", "Automated alert system"]
        },
        custom: {
            title: "Custom Models",
            description: "Every business is different. Fine-tune our forecasting algorithms to match your specific industry needs, product categories, and geographical variations.",
            icon: <Database className="w-12 h-12 text-emerald-500" />,
            benefits: ["Industry-specific tuning", "User-defined parameters", "A/B test different models"]
        }
    };

    const currentFeature = featuresData[featureId] || featuresData.predictions;

    return (
        <div className="min-h-screen pt-28 pb-12 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 md:p-14"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                        <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl shadow-inner border border-indigo-100/50 dark:border-indigo-800/20">
                            {currentFeature.icon}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl font-black mb-6">
                                <span className="text-gradient leading-tight">{currentFeature.title}</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {currentFeature.description}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-1 gap-6 mb-12">
                        <h2 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-2">
                             Standard Features
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentFeature.benefits.map((benefit, idx) => (
                                <motion.li 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-4 bg-white/50 dark:bg-gray-800/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800"
                                >
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full">
                                        <ShieldCheck className="text-emerald-600 dark:text-emerald-400 w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link 
                            to="/dashboard" 
                            className="flex-1 btn-gradient py-5 rounded-2xl font-black text-lg tracking-wide flex items-center justify-center gap-2 group"
                        >
                            Explore Dashboard
                            <LineChart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/" 
                            className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-5 rounded-2xl text-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Back to Home
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
                    © 2024 ForeSight AI. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;

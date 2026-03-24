import HeroSection from '../components/HeroSection';
import { BrainCircuit, BarChartHorizontalBig, UploadCloud } from 'lucide-react'; // Example icons

const HomePage = () => {
    return (
        <div>
            <HeroSection />

            <div className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">Why Demand Forecasting?</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {/* Feature 1 */}
                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <BrainCircuit className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Optimize Inventory</h3>
                            <p className="text-gray-600 dark:text-gray-400">Reduce holding costs and stockouts by accurately predicting product demand.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <BarChartHorizontalBig className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Improve Planning</h3>
                            <p className="text-gray-600 dark:text-gray-400">Make informed decisions about production, staffing, and marketing campaigns.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <UploadCloud className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Easy Visualization</h3>
                            <p className="text-gray-600 dark:text-gray-400">Simply upload your CSV data and instantly visualize historical trends and forecasts.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add more sections as needed */}
        </div>
    );
};

export default HomePage;
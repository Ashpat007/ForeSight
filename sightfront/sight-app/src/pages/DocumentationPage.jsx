import React, { useEffect } from "react";

const DocumentationPage = () => {
    // Add scroll animation trigger
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (sectionTop < windowHeight * 0.75) {
                    section.classList.add('animate-fade-in-up');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger on initial load
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .prose ul li::before {
                    background-color: currentColor;
                }
                .prose a {
                    transition: all 0.3s ease;
                }
                .prose a:hover {
                    text-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
                }
            `}</style>

            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 transition-all duration-500 text-gray-800 dark:text-gray-100 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-500">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-8 flex items-center gap-2 animate-float">
                    <span role="img" aria-label="book" className="inline-block">📘</span> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Documentation
                    </span>
                </h1>

                <div className="prose dark:prose-invert prose-lg max-w-none prose-pre:bg-gray-800 prose-pre:text-white prose-code:font-mono">
                    {/* Getting Started */}
                    <section className="opacity-0 mb-12">
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 inline-block">
                            Getting Started
                        </h2>
                        <p className="mb-4">
                            Welcome to the ForecastAI documentation. This tool helps you visualize and forecast demand
                            based on your historical sales data.
                        </p>
                        <p>
                            To begin, navigate to the{" "}
                            <a href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold relative group">
                                Dashboard
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>{" "}
                            page.
                        </p>
                    </section>

                    {/* Uploading Data */}
                    <section className="opacity-0 mb-12">
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 inline-block">
                            Uploading Data
                        </h2>
                        <p className="mb-4">
                            The dashboard requires a CSV (Comma Separated Values) file containing your historical sales data. 
                            Please ensure your file adheres to the following format:
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="transition-all duration-300 hover:pl-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                                The first row must be a header row containing column names.
                            </li>
                            <li className="transition-all duration-300 hover:pl-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                                Essential columns required for charting:
                                <ul className="mt-2 space-y-2 pl-6">
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                        <code>OrderDate</code>: The date of the sale (e.g., YYYY-MM-DD, MM/DD/YYYY).
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                        <code>UnitsSold</code>: The number of units sold (numeric).
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                        <code>ProductName</code>: The name of the product (text).
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                        <code>Category</code> (Optional): Product category (text).
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-2"></span>
                                        <code>TotalRevenue</code> (Optional): Total revenue for the transaction (numeric).
                                    </li>
                                </ul>
                            </li>
                            <li className="transition-all duration-300 hover:pl-2 hover:text-indigo-600 dark:hover:text-indigo-400">
                                Ensure data types are consistent within columns. Dates should be in a format that can be recognized.
                            </li>
                        </ul>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-500 mb-6 transition-all duration-500 hover:scale-[1.01]">
                            <p className="font-medium">
                                Click the <span className="text-indigo-600 dark:text-indigo-400 font-bold">"Select CSV File"</span> button on the dashboard, choose your file, and 
                                then click <span className="text-indigo-600 dark:text-indigo-400 font-bold">"Upload & Process"</span>.
                            </p>
                        </div>
                        <p>
                            A preview of the first few rows will be shown upon selection. The chart will update automatically 
                            after a successful upload.
                        </p>
                    </section>

                    {/* Using the Charts */}
                    <section className="opacity-0 mb-12">
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 inline-block">
                            Using the Charts
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full mr-3 mt-0.5 flex-shrink-0">
                                    1
                                </span>
                                Use the buttons ("Trend", "By Product", "Share") to switch between different chart types (Line, Bar, Pie).
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full mr-3 mt-0.5 flex-shrink-0">
                                    2
                                </span>
                                Hover over chart elements (lines, bars, pie slices) to view detailed tooltips.
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full mr-3 mt-0.5 flex-shrink-0">
                                    3
                                </span>
                                The charts are responsive and will adapt to different screen sizes.
                            </li>
                        </ul>
                    </section>

                    {/* Troubleshooting */}
                    <section className="opacity-0">
                        <h2 className="text-2xl font-bold mb-4 border-b-2 border-indigo-200 dark:border-indigo-800 pb-2 inline-block">
                            Troubleshooting
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500 transition-all duration-500 hover:shadow-md">
                                <h3 className="font-bold text-red-600 dark:text-red-400">Upload Failed</h3>
                                <p>Check your network connection and ensure the backend server is running. Verify your CSV format matches the requirements.</p>
                            </div>
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500 transition-all duration-500 hover:shadow-md">
                                <h3 className="font-bold text-yellow-600 dark:text-yellow-400">Chart Not Updating</h3>
                                <p>Ensure the upload was successful (check status message). If the data format is incorrect, the chart might not render properly.</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-all duration-500 hover:shadow-md">
                                <h3 className="font-bold text-blue-600 dark:text-blue-400">CSV Parsing Error</h3>
                                <p>The preview might fail if your CSV has complex quoting or delimiters. Ensure it's a standard comma-separated file.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage;
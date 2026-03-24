import { useState, useEffect, useRef } from "react";
import axios from "axios";
// Correct path (go up one level, then into components)
import ForecastChart from '../components/ForecastChart';
// Using more specific icons + Loader
import { UploadCloud, FileCheck, AlertTriangle, Loader2, FileText, Table, Trash2, Plus, X } from "lucide-react";

function DashboardPage() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ message: "", type: "idle" }); // type: idle, success, error
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState([]);
    const [columns, setColumns] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0); // Key to trigger ForecastChart refresh
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualEntry, setManualEntry] = useState({
        ProductID: "", ProductName: "", Category: "", UnitsSold: "", UnitPrice: "", OrderDate: new Date().toISOString().split("T")[0]
    });
    const fileInputRef = useRef(null); // Ref to trigger hidden file input

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Basic validation (optional)
            const isCSV = selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv');
            const isJSON = selectedFile.type === "application/json" || selectedFile.name.endsWith('.json');
            
            if (!isCSV && !isJSON) {
                 setStatus({ message: "Please select a valid CSV or JSON file.", type: "error" });
                 setFile(null);
                 setPreview([]);
                 setColumns([]);
                 if(fileInputRef.current) fileInputRef.current.value = "";
                 return;
             }
            setFile(selectedFile);
            setStatus({ message: "", type: "idle" }); // Reset status on new file selection
        }
    };

    // Trigger hidden file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Handle Manual Entry Submit
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const totalRevenue = Number(manualEntry.UnitsSold) * Number(manualEntry.UnitPrice);
            const dataToSave = [{ ...manualEntry, TotalRevenue: totalRevenue }];
            
            await axios.post("/api/upload", { data: dataToSave }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setStatus({ message: "✅ Record added successfully!", type: "success" });
            setRefreshKey(prevKey => prevKey + 1);
            setShowManualEntry(false);
            setManualEntry({ ProductID: "", ProductName: "", Category: "", UnitsSold: "", UnitPrice: "", OrderDate: new Date().toISOString().split("T")[0] });
        } catch (err) {
            setStatus({ message: "Failed to add record.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Reset all data from backend
    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to clear your data? This cannot be undone.")) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete("/api/data", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatus({ message: "🗑️ Your records cleared successfully!", type: "success" });
            setRefreshKey(prevKey => prevKey + 1);
            setFile(null);
            setPreview([]);
            setColumns([]);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to clear data.";
            setStatus({ message: errorMsg, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Handle the upload process
    const handleUpload = async () => {
        if (!file) {
            setStatus({ message: "Choose a CSV file first", type: "error" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            setStatus({ message: "", type: "idle" }); // Clear status before upload
            // Simulating upload delay (remove in production)
            // await new Promise(resolve => setTimeout(resolve, 1500));
            const token = localStorage.getItem('token');
            const res = await axios.post("/api/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setStatus({ message: res.data.message || "✅ Upload successful!", type: "success" });
            setRefreshKey(prevKey => prevKey + 1); // Increment key to trigger chart refresh
            // Optionally clear file/preview after successful upload
            // setFile(null);
            // setPreview([]);
            // setColumns([]);
            // if(fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
             // Try to get specific error from backend if available
             const errorMsg = err.response?.data?.message || err.message || "❌ Upload failed";
             setStatus({ message: errorMsg, type: "error" });
             console.error("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Generate preview from selected file (client-side)
    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    if (file.name.endsWith('.json')) {
                        const jsonData = JSON.parse(text);
                        const rows = Array.isArray(jsonData) ? jsonData.slice(0, 5) : [jsonData];
                        if (rows.length > 0) {
                            setColumns(Object.keys(rows[0]));
                            setPreview(rows);
                        }
                    } else {
                        const lines = text.split(/[\r\n]+/).filter(Boolean);
                        if (lines.length === 0) {
                             setStatus({ message: "File appears to be empty.", type: "error" });
                             setPreview([]); setColumns([]); return;
                        }
                        const header = lines[0].split(",").map(h => h.trim());
                        const rows = lines.slice(1, 6).map((line) => {
                            const values = line.split(",").map(v => v.trim());
                            return header.reduce((obj, h, i) => {
                                 obj[h] = values[i] !== undefined ? values[i] : '';
                                 return obj;
                            }, {});
                        });
                        setColumns(header);
                        setPreview(rows);
                    }
                } catch (parseError) {
                    console.error("Parse Error:", parseError);
                    setStatus({ message: "Error reading or parsing file.", type: "error" });
                    setPreview([]);
                    setColumns([]);
                }
            };
            reader.onerror = () => {
                console.error("File Reading Error:", reader.error);
                 setStatus({ message: "Could not read the selected file.", type: "error" });
                 setPreview([]);
                 setColumns([]);
            };
            reader.readAsText(file);
        } else {
            // Clear preview if file is removed
            setPreview([]);
            setColumns([]);
        }
    }, [file]); // Rerun when file changes

    // --- Status Message Styling ---
    const statusClasses = {
        idle: "",
        success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500",
        error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500",
    };
    const StatusIcon = status.type === 'success' ? FileCheck : AlertTriangle;


    return (
        // Use light gray for light mode, slightly darker gray for dark mode background
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 transition-colors duration-300">
            {/* Use container for max-width and centering */}
            <div className="container mx-auto max-w-6xl space-y-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                    <span className="text-gradient">Demand Forecasting Central</span>
                </h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Analyze, predict, and manage your inventory with neural intelligence.
                </p>

                {/* Upload Section Card */}
                <div className="glass-card p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                            <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Data Management
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Custom File Input Button */}
                        <button
                            onClick={triggerFileInput}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FileText className="w-4 h-4" />
                            <span>{file ? file.name : "Select CSV / JSON"}</span>
                        </button>
                        
                        {/* Hidden actual file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv, .json, text/csv, application/json"
                            onChange={handleFileChange}
                            className="hidden"
                            aria-hidden="true"
                        />

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${!file || loading ? 'bg-gray-300 dark:bg-gray-700 text-gray-500' : 'btn-gradient'}`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-4 animate-spin" />
                            ) : (
                                <UploadCloud className="w-5 h-5" />
                            )}
                            <span>{loading ? "Processing..." : "Process Data"}</span>
                        </button>

                        {/* Manual Entry Button */}
                        <button
                            onClick={() => setShowManualEntry(!showManualEntry)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Entry</span>
                        </button>

                        {/* Reset Database Button */}
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 disabled:opacity-50"
                            title="Clear all records from database"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Reset Data</span>
                        </button>
                    </div>

                    {/* Manual Entry Form */}
                    {showManualEntry && (
                        <form onSubmit={handleManualSubmit} className="mt-8 p-6 glass-card border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/10 space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-indigo-600 dark:text-indigo-400">Add New Sales Record</h3>
                                <button type="button" onClick={() => setShowManualEntry(false)}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Product ID" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.ProductID} onChange={e => setManualEntry({...manualEntry, ProductID: e.target.value})} />
                                <input type="text" placeholder="Product Name" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.ProductName} onChange={e => setManualEntry({...manualEntry, ProductName: e.target.value})} />
                                <input type="text" placeholder="Category" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.Category} onChange={e => setManualEntry({...manualEntry, Category: e.target.value})} />
                                <input type="number" placeholder="Units Sold" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.UnitsSold} onChange={e => setManualEntry({...manualEntry, UnitsSold: e.target.value})} />
                                <input type="number" placeholder="Unit Price" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.UnitPrice} onChange={e => setManualEntry({...manualEntry, UnitPrice: e.target.value})} />
                                <input type="date" required className="p-2 rounded bg-white dark:bg-gray-800 border dark:border-gray-700" value={manualEntry.OrderDate} onChange={e => setManualEntry({...manualEntry, OrderDate: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full btn-gradient py-3 rounded-xl font-bold tracking-wide">Sync New Record</button>
                        </form>
                    )}

                    {/* Status Message Area */}
                    {status.message && status.type !== 'idle' && (
                        <div className={`mt-4 px-4 py-3 rounded-md border-l-4 text-sm flex items-center gap-3 ${statusClasses[status.type]}`}>
                            <StatusIcon className="w-5 h-5 flex-shrink-0" />
                            <span>{status.message}</span>
                        </div>
                    )}
                     {/* Loading indicator during backend processing (subtle) */}
                     {loading && status.type === 'idle' && (
                         <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing Upload...
                         </div>
                     )}
                </div>

                {/* Preview Section Card (only show if preview has data) */}
                {preview.length > 0 && (
                    <div className="glass-card p-6 md:p-8">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-3">
                                <Table className="w-5 h-5 text-indigo-600 dark:text-indigo-400"/>
                            </div>
                            Live Feed Preview
                        </h2>
                        {/* Scrollable Table Container */}
                        <div className="overflow-x-auto max-h-72 border border-gray-100 dark:border-gray-700/50 rounded-xl overflow-hidden">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <tr>
                                        {columns.map((col, idx) => (
                                            <th key={idx} scope="col" className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap tracking-wider uppercase text-[10px] border-b border-gray-100 dark:border-gray-700">
                                                {col || `Column ${idx + 1}`}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {preview.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-150">
                                            {columns.map((col, i) => (
                                                <td key={i} className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                    <span className="block max-w-[200px] truncate font-medium" title={row[col]}>
                                                      {row[col]}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Forecast Chart - passing the refreshKey */}
                <ForecastChart refresh={refreshKey} />
            </div>
        </div>
    );
}

export default DashboardPage;
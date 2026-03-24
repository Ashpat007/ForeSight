// import { useState, useEffect, useRef } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import HomePage from './pages/HomePage';
// import DocumentationPage from './pages/DocumentationPage';
// import Login from './components/Auth/LoginPage';
// import Signup from './components/Auth/Signup';
// import ProtectedRoute from './components/Auth/ProtectedRoute';
// import axios from 'axios';
// import ForecastChart from './components/ForecastChart'; // Adjust the import based on where your ForecastChart is
// import { UploadCloud, FileCheck, AlertTriangle, Loader2, FileText, Table } from 'lucide-react';

// function App() {
//     // Authentication state
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             setIsAuthenticated(true);
//         }
//     }, []);

//     const setToken = (token) => {
//         if (token) {
//             localStorage.setItem('token', token);
//             setIsAuthenticated(true);
//         } else {
//             localStorage.removeItem('token');
//             setIsAuthenticated(false);
//         }
//     };

//     // File handling states
//     const [file, setFile] = useState(null);
//     const [status, setStatus] = useState({ message: '', type: 'idle' });
//     const [loading, setLoading] = useState(false);
//     const [preview, setPreview] = useState([]);
//     const [columns, setColumns] = useState([]);
//     const [refreshKey, setRefreshKey] = useState(0); // Key to trigger ForecastChart refresh
//     const fileInputRef = useRef(null);

//     // Handle file selection
//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         if (selectedFile) {
//             if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
//                 setStatus({ message: 'Please select a valid CSV file.', type: 'error' });
//                 setFile(null);
//                 setPreview([]);
//                 setColumns([]);
//                 if (fileInputRef.current) fileInputRef.current.value = '';
//                 return;
//             }
//             setFile(selectedFile);
//             setStatus({ message: '', type: 'idle' });
//         }
//     };

//     // Trigger hidden file input click
//     const triggerFileInput = () => {
//         fileInputRef.current?.click();
//     };

//     // Handle the upload process
//     const handleUpload = async () => {
//         if (!file) {
//             setStatus({ message: 'Choose a CSV file first', type: 'error' });
//             return;
//         }

//         const formData = new FormData();
//         formData.append('file', file);

//         try {
//             setLoading(true);
//             setStatus({ message: '', type: 'idle' });
//             const res = await axios.post('http://localhost:5000/api/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setStatus({ message: res.data.message || '✅ Upload successful!', type: 'success' });
//             setRefreshKey((prevKey) => prevKey + 1); // Increment key to trigger chart refresh
//         } catch (err) {
//             const errorMsg = err.response?.data?.message || err.message || '❌ Upload failed';
//             setStatus({ message: errorMsg, type: 'error' });
//             console.error('Upload error:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Generate preview from selected file (client-side)
//     useEffect(() => {
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 try {
//                     const text = e.target.result;
//                     const lines = text.split(/[\r\n]+/).filter(Boolean);
//                     if (lines.length === 0) {
//                         setStatus({ message: 'CSV file appears to be empty.', type: 'error' });
//                         setPreview([]);
//                         setColumns([]);
//                         return;
//                     }

//                     const header = lines[0].split(',').map((h) => h.trim());
//                     if (header.length === 0 || header.every((h) => !h)) {
//                         setStatus({ message: 'Could not parse CSV header.', type: 'error' });
//                         setPreview([]);
//                         setColumns([]);
//                         return;
//                     }

//                     const rows = lines.slice(1, 6).map((line) => {
//                         const values = line.split(',').map((v) => v.trim());
//                         return header.reduce((obj, h, i) => {
//                             obj[h] = values[i] !== undefined ? values[i] : '';
//                             return obj;
//                         }, {});
//                     });
//                     setColumns(header);
//                     setPreview(rows);
//                 } catch (parseError) {
//                     console.error('CSV Parse Error:', parseError);
//                     setStatus({ message: 'Error reading or parsing CSV file.', type: 'error' });
//                     setPreview([]);
//                     setColumns([]);
//                 }
//             };
//             reader.onerror = () => {
//                 console.error('File Reading Error:', reader.error);
//                 setStatus({ message: 'Could not read the selected file.', type: 'error' });
//                 setPreview([]);
//                 setColumns([]);
//             };
//             reader.readAsText(file);
//         } else {
//             setPreview([]);
//             setColumns([]);
//         }
//     }, [file]);

//     // Status message styling
//     const statusClasses = {
//         idle: '',
//         success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500',
//         error: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500',
//     };
//     const StatusIcon = status.type === 'success' ? FileCheck : AlertTriangle;

//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<Layout />}>
//                     <Route index element={<HomePage />} />
//                     <Route
//                         path="dashboard"
//                         element={
//                             <ProtectedRoute isAuthenticated={isAuthenticated}>
//                                 <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 md:p-8 transition-colors duration-300">
//                                     <div className="container mx-auto max-w-6xl space-y-8">
//                                         <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
//                                             📊 Demand Forecasting Dashboard
//                                         </h1>

//                                         {/* Upload Section Card */}
//                                         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
//                                             <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center">
//                                                 <UploadCloud className="w-5 h-5 mr-2 text-indigo-600" /> Upload Sales Data
//                                             </h2>
//                                             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                                                 <button
//                                                     onClick={triggerFileInput}
//                                                     className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                                 >
//                                                     <FileText className="w-4 h-4" />
//                                                     <span>{file ? file.name : 'Select CSV File'}</span>
//                                                 </button>
//                                                 <input
//                                                     ref={fileInputRef}
//                                                     type="file"
//                                                     accept=".csv, text/csv"
//                                                     onChange={handleFileChange}
//                                                     className="hidden"
//                                                     aria-hidden="true"
//                                                 />

//                                                 <button
//                                                     onClick={handleUpload}
//                                                     disabled={!file || loading}
//                                                     className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                                                 >
//                                                     {loading ? (
//                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                     ) : (
//                                                         <UploadCloud className="w-4 h-4" />
//                                                     )}
//                                                     <span>{loading ? 'Uploading...' : 'Upload & Process'}</span>
//                                                 </button>
//                                             </div>

//                                             {status.message && status.type !== 'idle' && (
//                                                 <div className={`mt-4 px-4 py-3 rounded-md border-l-4 text-sm flex items-center gap-3 ${statusClasses[status.type]}`}>
//                                                     <StatusIcon className="w-5 h-5 flex-shrink-0" />
//                                                     <span>{status.message}</span>
//                                                 </div>
//                                             )}

//                                             {loading && status.type === 'idle' && (
//                                                 <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2 animate-pulse">
//                                                     <Loader2 className="w-4 h-4 animate-spin" />
//                                                     Processing Upload...
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {preview.length > 0 && (
//                                             <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 md:p-6 border border-gray-200 dark:border-gray-700">
//                                                 <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center">
//                                                     <Table className="w-5 h-5 mr-2 text-indigo-600" /> Data Preview (First 5 Rows)
//                                                 </h2>
//                                                 <div className="overflow-x-auto max-h-72 border border-gray-200 dark:border-gray-700 rounded-md">
//                                                     <table className="min-w-full text-sm text-left">
//                                                         <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-10">
//                                                             <tr>
//                                                                 {columns.map((col, idx) => (
//                                                                     <th key={idx} scope="col" className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap tracking-wider uppercase text-xs border-b border-gray-200 dark:border-gray-600">
//                                                                         {col || `Column ${idx + 1}`}
//                                                                     </th>
//                                                                 ))}
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                                             {preview.map((row, idx) => (
//                                                                 <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
//                                                                     {columns.map((col, i) => (
//                                                                         <td key={i} className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                                                                             <span className="block max-w-[200px] truncate" title={row[col]}>
//                                                                                 {row[col]}
//                                                                             </span>
//                                                                         </td>
//                                                                     ))}
//                                                                 </tr>
//                                                             ))}
//                                                         </tbody>
//                                                     </table>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <ForecastChart refresh={refreshKey} />
//                                     </div>
//                                 </div>
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route path="documentation" element={<DocumentationPage />} />
//                     <Route path="*" element={<NoMatch />} />
//                 </Route>

//                 <Route path="/login" element={<Login setToken={setToken} />} />
//                 <Route path="/signup" element={<Signup setToken={setToken} />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }

// const NoMatch = () => (
//     <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
//         <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
//         <p className="text-lg mb-6">Sorry, the page you are looking for does not exist.</p>
//     </div>
// );

// export default App;
// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DocumentationPage from './pages/DocumentationPage';
import FeaturesPage from './pages/FeaturesPage';
import Login from './components/Auth/LoginPage';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const [token, setTokenState] = useState(localStorage.getItem('token'));

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout token={token} setToken={setToken} />}>
            <Route index element={<HomePage />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute token={token}>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="documentation" element={<DocumentationPage />} />
            <Route path="features/:featureId" element={<FeaturesPage />} />
          </Route>

          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;


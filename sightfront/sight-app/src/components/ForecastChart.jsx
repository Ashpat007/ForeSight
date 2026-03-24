import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Sector, AreaChart, Area, Rectangle, Brush
} from "recharts";
import { 
    FiBarChart2, FiPieChart, FiTrendingUp, FiAlertTriangle, 
    FiLoader, FiDatabase, FiDollarSign, FiShoppingCart, FiLayers, FiCpu,
    FiMaximize2, FiMinimize2
} from 'react-icons/fi';

// Enhanced color palette
const COLORS = {
    primary: '#4f46e5', // Indigo
    secondary: '#10b981', // Emerald
    tertiary: '#f59e0b', // Amber
    quaternary: '#8b5cf6', // Purple (for area chart)
    pieSlice1: '#6366f1',
    pieSlice2: '#34d399',
    pieSlice3: '#fbbf24',
    pieSlice4: '#f87171',
    pieSlice5: '#a78bfa',
    pieSlice6: '#60a5fa',
    grid: '#e5e7eb',
    textAxis: '#6b7280',
    textTitle: '#1f2937',
    textError: '#dc2626',
    textMuted: '#6b7280',
    bgLight: '#ffffff',
    bgTooltip: 'rgba(255, 255, 255, 0.9)',
    areaFill: 'rgba(139, 92, 246, 0.2)', // Purple with opacity
};

const PIE_COLORS = [
    COLORS.pieSlice1, COLORS.pieSlice2, COLORS.pieSlice3, 
    COLORS.pieSlice4, COLORS.pieSlice5, COLORS.pieSlice6
];

// Custom Active Shape for Pie Chart
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    
    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 4}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke={COLORS.bgLight}
                strokeWidth={2}
            />
        </g>
    );
};

const ForecastChart = ({ refresh }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState("line");
    const [activeIndex, setActiveIndex] = useState(0);
    const [forecastData, setForecastData] = useState(null);
    const [forecasting, setForecasting] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false); // Toggle for deep-dive view

    // Performance Optimized States
    const [summaryStats, setSummaryStats] = useState(null); // For top statistics cards
    const [statsData, setStatsData] = useState([]); // For pie/bar charts (e.g., product sales)
    const [trendData, setTrendData] = useState([]); // For line/area charts (e.g., time series)

    // Fetch data effect
    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            setError(null);
            // Clear previous data on refresh
            setSummaryStats(null);
            setStatsData([]);
            setTrendData([]);
            setForecastData(null);

            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Parallel High-Perf Requests
                const [sumRes, chartRes, foreRes] = await Promise.allSettled([
                    axios.get("/api/data/summary", { headers }),
                    axios.get("/api/data/chart", { headers }),
                    axios.get("/api/forecast", { headers }) // Reuses aggregation on backend
                ]);

                // Handle summary stats
                if (sumRes.status === 'fulfilled' && sumRes.value.status === 200 && sumRes.value.data) {
                    setSummaryStats(sumRes.value.data);
                } else if (sumRes.status === 'rejected') {
                    console.error("Summary fetch error:", sumRes.reason);
                }

                // Handle chart data (for pie/bar)
                if (chartRes.status === 'fulfilled' && chartRes.value.status === 200 && chartRes.value.data) {
                    setStatsData(chartRes.value.data);
                } else if (chartRes.status === 'rejected') {
                    console.error("Chart data fetch error:", chartRes.reason);
                }

                // Handle forecast data (for trend and forecast view)
                if (foreRes.status === 'fulfilled' && foreRes.value.status === 200 && foreRes.value.data) {
                    setForecastData(foreRes.value.data);
                    // Use historical data from forecast for trend charts
                    if (foreRes.value.data.historical) {
                        setTrendData(foreRes.value.data.historical);
                    }
                } else if (foreRes.status === 'rejected') {
                    console.error("Forecast fetch error:", foreRes.reason);
                }

                // Determine overall data presence
                if (!sumRes.value?.data && !chartRes.value?.data && !foreRes.value?.data?.historical) {
                    setError("No data found. Upload a CSV to visualize.");
                }

            } catch (err) {
                console.error("Overall fetch error:", err);
                setError("Failed to load optimized chart data.");
            } finally {
                setLoading(false);
            }
        };
        fetchChartData();
    }, [refresh]);

    // Handle Scroll Lock for Immersive Mode
    useEffect(() => {
        if (isMaximized) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMaximized]);

    // Derived statistics for render logic (No loops here!)
    const stats = summaryStats; // Directly use pre-aggregated summary stats
    const pieData = statsData; // Directly use pre-aggregated chart data for pie/bar

    // Pie chart hover handlers
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    // Button styling
    const getButtonClass = (type) => {
        const baseClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm";
        const activeClasses = "ring-2 ring-offset-1";
        const inactiveClasses = "hover:shadow-md";

        let colorClasses = "";
        let activeRingColor = "";

        switch (type) {
            case "line":
                colorClasses = `bg-indigo-100 text-indigo-700 hover:bg-indigo-200`;
                activeRingColor = "focus:ring-indigo-500 ring-indigo-500";
                break;
            case "bar":
                colorClasses = `bg-emerald-100 text-emerald-700 hover:bg-emerald-200`;
                activeRingColor = "focus:ring-emerald-500 ring-emerald-500";
                break;
            case "pie":
                colorClasses = `bg-amber-100 text-amber-700 hover:bg-amber-200`;
                activeRingColor = "focus:ring-amber-500 ring-amber-500";
                break;
            case "area":
                colorClasses = `bg-purple-100 text-purple-700 hover:bg-purple-200`;
                activeRingColor = "focus:ring-purple-500 ring-purple-500";
                break;
            case "forecast":
                colorClasses = `bg-pink-100 text-pink-700 hover:bg-pink-200`;
                activeRingColor = "focus:ring-pink-500 ring-pink-500";
                break;
            default:
                colorClasses = `bg-gray-100 text-gray-700 hover:bg-gray-200`;
                activeRingColor = "focus:ring-gray-500 ring-gray-500";
        }

        return `${baseClasses} ${colorClasses} ${chartType === type ? `${activeClasses} ${activeRingColor}` : `${inactiveClasses} focus:ring-gray-400`}`;
    };

    // Render chart area
    const renderChartArea = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const themeColors = {
            grid: isDark ? '#374151' : '#e5e7eb',
            text: isDark ? '#9ca3af' : '#6b7280',
            tooltipBg: isDark ? '#1f2937' : '#ffffff',
            tooltipText: isDark ? '#f3f4f6' : '#1f2937'
        };

        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FiLoader className="animate-spin text-4xl mb-3" />
                    <span>Loading Data...</span>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-600">
                    <FiAlertTriangle className="text-4xl mb-3" />
                    <span>{error}</span>
                </div>
            );
        }
        if (!trendData || trendData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FiDatabase className="text-4xl mb-3" />
                    <span>No data found. Upload a CSV to visualize.</span>
                </div>
            );
        }

        const chartBaseClasses = "transition-opacity duration-500 ease-in-out";
        const chartVisibleClass = "opacity-100";
        const chartHiddenClass = "opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none";

        return (
            <div className="relative w-full h-full">
                {/* Line Chart */}
                <div className={`${chartBaseClasses} ${chartType === 'line' ? chartVisibleClass : chartHiddenClass}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                            <XAxis dataKey="OrderDate" stroke={themeColors.text} fontSize={12} />
                            <YAxis stroke={themeColors.text} fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: themeColors.tooltipBg,
                                    borderRadius: '6px',
                                    borderColor: themeColors.grid,
                                    color: themeColors.tooltipText,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                }}
                                itemStyle={{ color: themeColors.tooltipText }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey="UnitsSold"
                                name="Units Sold"
                                stroke={COLORS.primary}
                                strokeWidth={2}
                                dot={trendData.length < 100 ? { r: 3, strokeWidth: 1, fill: COLORS.primary } : false}
                                activeDot={{ r: 6, stroke: isDark ? '#111827' : '#fff', strokeWidth: 2, fill: COLORS.primary }}
                            />
                            <Line
                                type="monotone"
                                dataKey="TotalRevenue"
                                name="Revenue ($)"
                                stroke={COLORS.secondary}
                                strokeWidth={2}
                                dot={trendData.length < 100 ? { r: 3, strokeWidth: 1, fill: COLORS.secondary } : false}
                                activeDot={{ r: 6, stroke: isDark ? '#111827' : '#fff', strokeWidth: 2, fill: COLORS.secondary }}
                            />
                            <Brush dataKey="OrderDate" height={30} stroke={COLORS.primary} fill={isDark ? "#1f2937" : "#fff"} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className={`${chartBaseClasses} ${chartType === 'bar' ? chartVisibleClass : chartHiddenClass}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pieData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                            <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tick={{ angle: -15, textAnchor: 'end' }} height={50} />
                            <YAxis stroke={themeColors.text} fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: themeColors.tooltipBg,
                                    borderRadius: '6px',
                                    borderColor: themeColors.grid,
                                    color: themeColors.tooltipText,
                                }}
                                itemStyle={{ color: themeColors.tooltipText }}
                                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar
                                dataKey="UnitsSold"
                                name="Units Sold"
                                fill={COLORS.secondary}
                                radius={[4, 4, 0, 0]}
                                isAnimationActive={true}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className={`${chartBaseClasses} ${chartType === 'pie' ? chartVisibleClass : chartHiddenClass}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: themeColors.tooltipBg,
                                    borderRadius: '12px',
                                    borderColor: themeColors.grid,
                                    color: themeColors.tooltipText,
                                }}
                                itemStyle={{ color: themeColors.tooltipText }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Pie
                                data={pieData}
                                dataKey="UnitsSold"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                innerRadius="50%"
                                fill={COLORS.primary}
                                paddingAngle={2}
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={isDark ? '#1f2937' : '#fff'} strokeWidth={1} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Area Chart */}
                <div className={`${chartBaseClasses} ${chartType === 'area' ? chartVisibleClass : chartHiddenClass}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorUnitsSold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.quaternary} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={COLORS.quaternary} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                            <XAxis dataKey="OrderDate" stroke={themeColors.text} fontSize={12} />
                            <YAxis stroke={themeColors.text} fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: themeColors.tooltipBg,
                                    borderRadius: '6px',
                                    borderColor: themeColors.grid,
                                    color: themeColors.tooltipText,
                                }}
                                itemStyle={{ color: themeColors.tooltipText }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Area
                                type="monotone"
                                dataKey="UnitsSold"
                                name="Units Sold"
                                stroke={COLORS.quaternary}
                                fillOpacity={1}
                                fill="url(#colorUnitsSold)"
                                dot={trendData.length < 100 ? { r: 3, strokeWidth: 1, fill: COLORS.quaternary } : false}
                                activeDot={{ r: 6, stroke: isDark ? '#111827' : '#fff', strokeWidth: 2, fill: COLORS.quaternary }}
                            />
                            <Brush dataKey="OrderDate" height={30} stroke={COLORS.quaternary} fill={isDark ? "#1f2937" : "#fff"} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Forecast Chart */}
                <div className={`${chartBaseClasses} ${chartType === 'forecast' ? chartVisibleClass : chartHiddenClass}`}>
                    {forecasting ? (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-500">
                             <FiCpu className="animate-spin text-4xl mb-3" />
                             <span className="animate-pulse">Analyzing demand patterns...</span>
                        </div>
                    ) : forecastData ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[...forecastData.historical, ...forecastData.forecast]} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
                                <XAxis dataKey="OrderDate" stroke={themeColors.text} fontSize={12} />
                                <YAxis stroke={themeColors.text} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: themeColors.tooltipBg,
                                        borderRadius: '12px',
                                        borderColor: themeColors.grid,
                                        color: themeColors.tooltipText,
                                    }}
                                    itemStyle={{ color: themeColors.tooltipText }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                {/* Historical Data */}
                                <Line
                                    type="monotone"
                                    dataKey="UnitsSold"
                                    name="Historical Sales"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    dot={trendData.length < 100 ? { r: 4, fill: COLORS.primary } : false}
                                    activeDot={{ r: 8 }}
                                />
                                {/* Forecast Data */}
                                <Line
                                    type="monotone"
                                    dataKey="PredictedUnits"
                                    name="AI Forecasted Demand"
                                    stroke="#ec4899"
                                    strokeDasharray="5 5"
                                    strokeWidth={3}
                                    dot={trendData.length < 100 ? { r: 5, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' } : false}
                                    activeDot={{ r: 8 }}
                                />
                                <Brush dataKey="OrderDate" height={30} stroke={COLORS.primary} fill={isDark ? "#1f2937" : "#fff"} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                             <FiCpu className="text-4xl mb-3" />
                             <span>Click AI Forecast to analyze your data.</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render statistics cards
    const renderStatsCards = () => {
        if (!stats) return null;

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Units Sold */}
                <div className="glass-card p-5 border-none bg-indigo-50/50 dark:bg-indigo-950/20">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-indigo-500 text-white mr-4 shadow-lg shadow-indigo-500/30">
                            <FiShoppingCart className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Total Units</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalUnits.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="glass-card p-5 border-none bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-emerald-500 text-white mr-4 shadow-lg shadow-emerald-500/30">
                            <FiDollarSign className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Revenue</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Average Daily Sales */}
                <div className="glass-card p-5 border-none bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-amber-500 text-white mr-4 shadow-lg shadow-amber-500/30">
                            <FiTrendingUp className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Daily Avg</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.avgUnitsPerDay}</p>
                        </div>
                    </div>
                </div>

                {/* Top Product */}
                <div className="glass-card p-5 border-none bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-purple-500 text-white mr-4 shadow-lg shadow-purple-500/30">
                            <FiLayers className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Top Product</p>
                            <p className="text-lg font-black truncate text-gray-900 dark:text-white">{stats.topProduct?.name || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`transition-all duration-500 ease-in-out ${isMaximized ? "fixed inset-0 z-[9999] bg-white dark:bg-gray-900 p-4 md:p-10 overflow-y-auto" : "mt-8"}`}>
            <div className={`glass-card ${isMaximized ? "min-h-full border-none shadow-none bg-transparent dark:bg-transparent p-0" : "p-6 md:p-8"}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 flex items-center space-x-3">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg">
                            <FiTrendingUp className="text-white" />
                        </div>
                        <span className="tracking-tight uppercase text-lg">Predictive Intelligence</span>
                    </h2>
                    
                    {!loading && !error && (
                        <div className="flex items-center space-x-4">
                            {isMaximized && (
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest hidden md:block">
                                    Deep Analysis Mode
                                </span>
                            )}
                            <button 
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all shadow-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                title={isMaximized ? "Exit Full Screen" : "Enter Full Screen"}
                            >
                                {isMaximized ? <FiMinimize2 size={24} /> : <FiMaximize2 size={24} />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Statistics Cards */}
                {renderStatsCards()}

                {/* Chart Type Selector */}
                <div className="mb-6 md:mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    <button onClick={() => setChartType("line")} className={getButtonClass("line")}>
                        <FiTrendingUp /> <span>Historical Trend</span>
                    </button>
                    <button onClick={() => setChartType("bar")} className={getButtonClass("bar")}>
                        <FiBarChart2 /> <span>Category Sales</span>
                    </button>
                    <button onClick={() => setChartType("pie")} className={getButtonClass("pie")}>
                        <FiPieChart /> <span>Market Share</span>
                    </button>
                    <button onClick={() => setChartType("area")} className={getButtonClass("area")}>
                        <FiTrendingUp /> <span>Revenue Flow</span>
                    </button>
                    <button onClick={() => setChartType("forecast")} className={getButtonClass("forecast")}>
                        <FiCpu /> <span>AI Predictive Analytics</span>
                    </button>
                </div>

                {/* Chart Area */}
                <div className={`${isMaximized ? 'h-[60vh] md:h-[70vh]' : 'h-[400px] md:h-[450px]'} w-full transition-all duration-500 ease-in-out`}>
                    {renderChartArea()}
                </div>
                
                {isMaximized && (
                    <div className="mt-10 py-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-sm text-gray-500 italic">
                            Analyzing aggregated data points from {summaryStats?.recordCount?.toLocaleString() || 'all'} records. 
                            Use the slider at the bottom of the chart to zoom.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForecastChart;
    import { useEffect, useState } from "react";
    import { Card, CardContent } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
    import { Download } from "lucide-react";
    import { AuthContext } from "../context/AuthContext";   // ✅ Import Auth Context
    import { Navigate } from "react-router-dom";       // ✅ To redirect if no access

    interface PerformanceData {
    timestamp: string;
    value: number;
    return: number;
    }

    export default function PortfolioAnalytics() {
    const [performance, setPerformance] = useState<PerformanceData[]>([]);
    const [sharpe, setSharpe] = useState<number | null>(null);
    const [correlation, setCorrelation] = useState<Record<string, Record<string, number>>>({});
    
    const { user } = useContext(AuthContext); // ✅ Access logged-in user & role

    // RBAC Check → Only Tier3 can view
    if (!user || user.clearance !== "Tier3") {
        return <Navigate to="/dashboard" replace />;
    }

    // Fetch all analytics
    useEffect(() => {
        fetch("/api/portfolio-analytics/performance")
        .then(res => res.json())
        .then(data => setPerformance(data));

        fetch("/api/portfolio-analytics/sharpe")
        .then(res => res.json())
        .then(data => setSharpe(data.sharpe_ratio));

        fetch("/api/portfolio-analytics/correlation")
        .then(res => res.json())
        .then(data => setCorrelation(data));
    }, []);

    const downloadFile = (type: "csv" | "pdf") => {
        window.open(`/api/portfolio-analytics/export/${type}`, "_blank");
    };

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Growth */}
        <Card className="col-span-2">
            <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Portfolio Growth Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* Sharpe Ratio */}
        <Card>
            <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Sharpe Ratio</h2>
            {sharpe !== null ? (
                <p className="text-2xl font-bold">{sharpe}</p>
            ) : (
                <p className="text-gray-500">Loading...</p>
            )}
            </CardContent>
        </Card>

        {/* Correlation Matrix */}
        <Card>
            <CardContent className="p-4 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Correlation Matrix</h2>
            {Object.keys(correlation).length > 0 ? (
                <table className="table-auto border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr>
                    <th className="border border-gray-300 px-2 py-1">Symbol</th>
                    {Object.keys(correlation).map(sym => (
                        <th key={sym} className="border border-gray-300 px-2 py-1">{sym}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(correlation).map(row => (
                    <tr key={row}>
                        <td className="border border-gray-300 px-2 py-1 font-medium">{row}</td>
                        {Object.keys(correlation[row]).map(col => (
                        <td key={col} className="border border-gray-300 px-2 py-1 text-center">
                            {correlation[row][col].toFixed(2)}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p className="text-gray-500">Loading...</p>
            )}
            </CardContent>
        </Card>

        {/* Export Buttons */}
        <Card className="col-span-2">
            <CardContent className="p-4 flex gap-4">
            <Button onClick={() => downloadFile("csv")}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => downloadFile("pdf")}>
                <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            </CardContent>
        </Card>
        </div>
    );
    }

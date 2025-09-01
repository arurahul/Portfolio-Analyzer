    import React, { useEffect, useState } from "react";
    import { getPortfolioAnalytics } from "../services/api";
    import {
    PieChart, Pie, Cell, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid
    } from "recharts";

    export default function PortfolioAnalytics() {
    const [analytics, setAnalytics] = useState<any | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const fetchAnalytics = async (start?: string, end?: string) => {
        setLoading(true);
        setError("");
        try {
        const params: any = {};
        if (start) params.start_date = start;
        if (end) params.end_date = end;

        const res = await getPortfolioAnalytics(params);
        setAnalytics(res.data);
        } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch analytics");
        setAnalytics(null);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!analytics) return <p>No analytics available</p>;

    return (
        <div className="analytics-container">
        <h3>Portfolio Analytics</h3>

        {/* Date Filter */}
        <div style={{ marginBottom: 20 }}>
            <label>
            Start Date:
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginLeft: 10, marginRight: 20 }}
            />
            </label>
            <label>
            End Date:
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: 10, marginRight: 20 }}
            />
            </label>
            <button onClick={() => fetchAnalytics(startDate, endDate)}>Apply</button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
            <h5>Total Value</h5>
            <p>${analytics.totalValue.toLocaleString()}</p>
            </div>
            <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
            <h5>Risk Score</h5>
            <p>{analytics.riskScore}</p>
            </div>
        </div>

        {/* Allocation Pie Chart */}
        <div style={{ width: 400, height: 300 }}>
            <h5>Asset Allocation</h5>
            <PieChart width={400} height={300}>
            <Pie
                data={analytics.allocation}
                dataKey="value"
                nameKey="asset_type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
            >
                {analytics.allocation.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
            </PieChart>
        </div>

        {/* Historical Portfolio Line Chart */}
        <div style={{ width: "100%", height: 300, marginTop: 20 }}>
            <h5>Portfolio Value History</h5>
            <LineChart width={600} height={300} data={analytics.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="portfolio_value" stroke="#8884d8" />
            </LineChart>
        </div>

        {/* Risk Scores Table */}
        <div style={{ marginTop: 20 }}>
            <h5>Risk Scores</h5>
            <table className="table table-bordered">
            <thead>
                <tr>
                <th>Asset</th>
                <th>Risk Score</th>
                </tr>
            </thead>
            <tbody>
                {analytics.risk.map((r: any, i: number) => (
                <tr key={i}>
                    <td>{r.asset_name}</td>
                    <td>
                    <div
                        style={{
                        background: `linear-gradient(to right, #FF0000, #00FF00)`,
                        width: `${(r.risk_score / 10) * 100}%`,
                        height: "20px",
                        color: "#fff",
                        textAlign: "center",
                        }}
                    >
                        {r.risk_score}
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    }

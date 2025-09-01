    import React, { useState, useEffect, useContext } from "react";
    import { getAllPortfolioRecords, uploadPortfolioCSV, updatePortfolioRecord, deletePortfolioRecord, getPortfolioAnalytics } from "../services/api";
    import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
    } from "recharts";
    import { AuthContext } from "../context/AuthContext"

    export default function PortfolioDashboard() {
    const { user } = useContext(AuthContext); // ✅ Access logged-in user & role
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [records, setRecords] = useState<any[]>([]);
    const [editRow, setEditRow] = useState<number | null>(null);
    const [editData, setEditData] = useState({ quantity: "", value: "" });
    const [analytics, setAnalytics] = useState<any | null>(null);

    // Load portfolio records on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
        const res = await getAllPortfolioRecords();
        setRecords(res.data);

        const analyticsRes = await getPortfolioAnalytics();
        setAnalytics(analyticsRes.data);
        } catch (err) {
        console.error("Error fetching records/analytics", err);
        }
    };

    const diversificationData = analytics
        ? Object.entries(analytics.diversification_breakdown).map(([stock, value]) => ({
            name: stock,
            value: value,
        }))
        : [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage("Please select a file");
        return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
        const res = await uploadPortfolioCSV(formData);
        setMessage(res.data.message || "Upload successful!");
        setFile(null);
        loadData();
        } catch (err: any) {
        setMessage(err.response?.data?.message || "Upload failed.");
        }
    };

    const handleEditClick = (record: any) => {
        setEditRow(record.id);
        setEditData({ quantity: record.quantity, value: record.value });
    };

    const handleCancel = () => {
        setEditRow(null);
        setEditData({ quantity: "", value: "" });
    };

    const handleSave = async (id: any) => {
        try {
        await updatePortfolioRecord(id, editData);
        loadData();
        setEditRow(null);
        } catch (err) {
        console.error("Update failed", err);
        }
    };

    const handleDelete = async (id: any) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
        await deletePortfolioRecord(id);
        loadData();
        } catch (err) {
        console.error("Delete failed", err);
        }
    };

    const stockValueData = records.map((record: any) => ({
        name: record.stock_name,
        value: record.value,
    }));

    return (
        <div className="container mt-4">
        <h3>Portfolio Management</h3>

        {/* CSV Upload Section (only Analyst/Admin) */}
        {(user?.role === "analyst" || user?.role === "admin") && (
            <div className="mb-4 p-3 border rounded">
            <h5>Upload Portfolio CSV</h5>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button className="btn btn-primary mt-2" onClick={handleUpload}>
                Upload
            </button>
            <p className="mt-2">{message}</p>
            </div>
        )}

        {/* Analytics Section */}
        {analytics && (
            <div className="mb-4 p-3 border rounded">
            <h5>Portfolio Insights</h5>
            <p><strong>Total Value:</strong> ${analytics.total_value}</p>
            <p><strong>Diversification:</strong> {analytics.diversification}%</p>
            <p><strong>Risk Level:</strong> {analytics.risk_level}</p>
            </div>
        )}

        {/* Diversification Pie Chart */}
        {diversificationData.length > 0 && (
            <div className="mb-4 p-3 border rounded">
            <h5>Portfolio Diversification</h5>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={diversificationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {diversificationData.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]}
                    />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </ResponsiveContainer>
            </div>
        )}

        {/* Stock Values Bar Chart */}
        {stockValueData.length > 0 && (
            <div className="mb-4 p-3 border rounded">
            <h5>Stock Values (Bar Chart)</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            </div>
        )}

        {/* Table Section */}
        <h5>Portfolio Records</h5>
        <table className="table table-bordered">
            <thead>
            <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Value</th>
                {(user?.role === "admin") && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {records.map((record: any) => (
                <tr key={record.id}>
                <td>{record.stock_name}</td>
                <td>
                    {editRow === record.id ? (
                    <input
                        type="number"
                        value={editData.quantity}
                        onChange={(e) =>
                        setEditData({ ...editData, quantity: e.target.value })
                        }
                    />
                    ) : (
                    record.quantity
                    )}
                </td>
                <td>
                    {editRow === record.id ? (
                    <input
                        type="number"
                        value={editData.value}
                        onChange={(e) =>
                        setEditData({ ...editData, value: e.target.value })
                        }
                    />
                    ) : (
                    record.value
                    )}
                </td>
                {/* Actions only for Admin */}
                {user?.role === "admin" && (
                    <td>
                    {editRow === record.id ? (
                        <>
                        <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleSave(record.id)}
                        >
                            Save
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        </>
                    ) : (
                        <>
                        <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEditClick(record)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(record.id)}
                        >
                            Delete
                        </button>
                        </>
                    )}
                    </td>
                )}
                </tr>
            ))}
            {records.length === 0 && (
                <tr>
                <td colSpan={user?.role === "admin" ? 4 : 3} className="text-center">
                    No portfolio records found.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
    }

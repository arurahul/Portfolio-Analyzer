    import React, { useState, useEffect } from "react";
    import { getAllPortfolioRecords, updatePortfolioRecord, deletePortfolioRecord } from "../services/api";

    export default function PortfolioTable() {
    const [records, setRecords] = useState([]);
    const [editRow, setEditRow] = useState(null);
    const [editData, setEditData] = useState({ quantity: "", value: "" });

    // Load portfolio records on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
        const res = await getAllPortfolioRecords();
        setRecords(res.data);
        } catch (err) {
        console.error("Error fetching records", err);
        }
    };

    const handleEditClick = (record:any) => {
        setEditRow(record.id);
        setEditData({ quantity: record.quantity, value: record.value });
    };

    const handleCancel = () => {
        setEditRow(null);
        setEditData({ quantity: "", value: "" });
    };

    const handleSave = async (id:any) => {
        try {
        await updatePortfolioRecord(id, editData);
        loadData();
        setEditRow(null);
        } catch (err) {
        console.error("Update failed", err);
        }
    };

    const handleDelete = async (id:any) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
        await deletePortfolioRecord(id);
        loadData();
        } catch (err) {
        console.error("Delete failed", err);
        }
    };

    return (
        <div className="container mt-4">
        <h3>Portfolio Records</h3>
        <table className="table table-bordered">
            <thead>
            <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {records.map((record:any) => 
            (
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
                </tr>
            ))}
            {records.length === 0 && (
                <tr>
                <td colSpan="4" className="text-center">
                    No portfolio records found.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
    }

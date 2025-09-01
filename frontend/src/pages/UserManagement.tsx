import React, { useState, useEffect } from 'react';
import { getUsers, deactivateUser, resetPassword, updateUser } from '../services/userService'


export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await getUsers();
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeactivate(id: number) {
        await deactivateUser(id);
        fetchUsers();
    }

    async function handleResetPassword(id: number) {
        await resetPassword(id);
        alert("Password reset. Check email/logs.");
    }

    async function handleRoleChange(id: number, role: string) {
        await updateUser(id, { role });
        fetchUsers();
    }

    // 🔹 Filter logic
    useEffect(() => {
        let filtered = [...users];

        if (search) {
            filtered = filtered.filter((u) =>
                u.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [search, roleFilter, users]);

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="container mt-4">
            <h3>User Management</h3>

            {/* 🔹 Search + Filter Controls */}
            <div className="d-flex gap-3 mb-3">
                <input
                    type="text"
                    placeholder="Search by email"
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="form-select"
                >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* 🔹 Users Table */}
            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th style={{ width: "250px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <span
                                        className={`badge ${u.is_active ? "bg-success" : "bg-secondary"
                                            }`}
                                    >
                                        {u.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleDeactivate(u.id)}
                                    >
                                        Deactivate
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleResetPassword(u.id)}
                                    >
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
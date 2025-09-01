import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSystemSettings } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SystemSettings() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [settings, setSettings] = useState<{ [key: string]: any } | null>(null);
    const [formState, setFormState] = useState<{ [key: string]: any }>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const isTier1 = user?.clearance === "Tier1"; // 🔑 RBAC Check

    useEffect(() => {
        if (!isTier1) {
            // 🚫 Block non-Tier1 users immediately
            alert("Access Denied. You need Tier1 clearance.");
            navigate("/dashboard");
            return;
        }

        async function fetchSettings() {
            try {
                const response = await getSystemSettings();
                setSettings(response.data);
                setFormState(response.data);
            } catch (err: any) {
                if (err.response && err.response.status === 403) {
                    alert("Access Denied. You need Tier1 clearance.");
                    navigate("/dashboard");
                } else {
                    setError("Failed to fetch settings.");
                }
            }
        }
        fetchSettings();
    }, [isTier1, navigate]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Updated Settings:", formState);
        setSuccess("Settings saved (simulated)");
    };

    return (
        <div className="settings-container">
            <h2>⚙️ System Settings</h2>
            {settings ? (
                <div className="settings-card">
                    {Object.entries(formState).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: "10px" }}>
                            <label><strong>{key}:</strong></label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                    <button onClick={handleSave}>Save Settings</button>
                    {success && <p style={{ color: "green" }}>{success}</p>}
                </div>
            ) : (
                <p>Loading system settings...</p>
            )}

            <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
    );
}

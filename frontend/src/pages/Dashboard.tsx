    import { useContext, useState, useEffect } from 'react';
    import { Link } from "react-router-dom";
    import { AuthContext } from '../context/AuthContext';
    import { getClientPortfolioData } from '../services/api';

    export default function Dashboard() {
    const {user,logout}=useContext(AuthContext);
    const [clientData, setClientData] = useState<{
        portfolioValue: number;
        riskScore: number;
        lastUpdated: string;
        holdings: string[];
    } | null>(null);

    const isFinanceDept = user?.department === 'Finance';
    const isClearanceHigh = Number(user?.clearance) >= 4;
    const isTier1 = user?.clearance === "Tier1";

    useEffect(() => {
        async function fetchData() {
        try {
            const response = await getClientPortfolioData();
            setClientData(response.data);
        } catch (error) {
            alert('Failed to load portfolio data');
        }
        }

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
        <div className="dashboard-card">
            <h2>Welcome, {user?.email}</h2>
            <p><strong>Department:</strong> {user?.department}</p>
            <p><strong>Clearance:</strong> {user?.clearance}</p>

            {clientData ? (
            <div className="data-section">
                <p><strong>Portfolio Value:</strong> ${clientData.portfolioValue.toLocaleString()}</p>
                <p><strong>Risk Score:</strong> {clientData.riskScore}</p>
                <p><strong>Last Updated:</strong> {clientData.lastUpdated}</p>
                <div>
                <strong>Holdings:</strong>
                <ul>
                    {clientData.holdings.map((h, i) => (
                    <li key={i}>{h}</li>
                    ))}
                </ul>
                </div>
                {/* Link to new Portfolio Dashboard */}
                <Link to="/portfolio" className="btn btn-primary mt-3">
                📂 Go to Portfolio Dashboard
                </Link>
            </div>
            ) : (
            <p>Loading portfolio data...</p>
            )}

            {isFinanceDept && (
            <div className="finance-section">
                <h4>Finance Tools</h4>
                <p>📈 Market Insights, 💹 Risk Management Dashboard</p>
            </div>
            )}

            {isClearanceHigh && (
            <div className="secure-section">
                <h4>High Clearance Access</h4>
                <p>🔐 Viewing restricted investment data</p>
            </div>
            )}

            {isTier1 && (
            <div className="admin-section">
                <h4>Admin Tools</h4>
                <Link to="/settings" className="settings-link">
                ⚙️ Go to System Settings
                </Link>
            </div>
            )}

            <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        </div>
    );
    }

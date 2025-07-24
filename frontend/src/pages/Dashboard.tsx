import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div style={{ padding: '20px' }}>
        <h2>Welcome, {user?.email}</h2>
        <p>Department: {user?.department}</p>
        <p>Clearance Level: {user?.clearance}</p>
        <button onClick={logout} style={{ marginTop: '20px' }}>
            Logout
        </button>
        </div>
    );
}
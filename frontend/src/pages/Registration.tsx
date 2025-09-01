import {useState,useEffect} from "react";
import api from '../services/api';
import { useNavigate } from "react-router-dom";

export default function Register()
{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [success,setSuccess]=useState("")
    const [error,setError]=useState("")
    const [clearance,setClearance]=useState("Intern")
    const [department, setDepartment] = useState('');
    const navigate = useNavigate();
    const handleRegister=(e: React.FormEvent)=>{
        e.preventDefault()
        setError("")
        setSuccess("")
        try{
            const response = api.post('/register', {
                email,
                password,
                clearance,
                department,
            });
            setSuccess(response.data.message);
            setEmail('');
            setPassword('');
            setClearance('Intern');
            setDepartment('');
            navigate('/login');
        }
        catch(err: any)
        {
            setError(err.response?.data?.error || 'Registration failed');
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
            <h2>User Registration</h2>
            <form onSubmit={handleRegister}>
                <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%' }}
                />
                <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%' }}
                />
                <select
                value={clearance}
                onChange={(e) => setClearance(e.target.value)}
                required
                style={{ display: 'block', marginBottom: 10, width: '100%' }}
                >
                <option value="Intern">Intern</option>
                <option value="Analyst">Analyst</option>
                <option value="Tier3">Tier3</option>
                <option value="Tier2">Tier2</option>
                <option value="Tier1">Tier1</option>
                </select>
                <input
                type="text"
                placeholder="Department (optional)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%' }}
                />
                <button type="submit" className="btn" style={{ width: '100%' }}>
                Register
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: 10 }}>{success}</p>}
        </div>
    )
}
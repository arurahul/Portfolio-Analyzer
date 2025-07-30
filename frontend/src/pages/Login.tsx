    import { useState, useContext } from 'react';
    import { AuthContext } from '../context/AuthContext';
    import { useNavigate } from 'react-router-dom';

    export default function Login() {
    const { login, verify2FA, tempToken } = useContext(AuthContext)!;
    const navigate = useNavigate();

    // States for login form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // States for 2FA form
    const [code, setCode] = useState('');
    const [twoFAError, setTwoFAError] = useState('');

    // Flag to show 2FA form after login
    const [awaiting2FA, setAwaiting2FA] = useState(false);

    // Handle initial login submit
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
        await login(email, password);
        setAwaiting2FA(true);
        } catch (err: any) {
        setLoginError(err.message);
        }
    };

    // Handle 2FA submit
    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTwoFAError('');
        try {
        await verify2FA(code);
        navigate('/dashboard');
        } catch (err: any) {
        setTwoFAError(err.message);
        }
    };

    // Render login or 2FA form conditionally
    if (awaiting2FA && tempToken) {
        return (
        <div style={{ padding: '20px' }}>
            <h2>Two-Factor Authentication</h2>
            <form onSubmit={handle2FASubmit}>
            <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                style={{ fontSize: '1.5rem', width: '150px', letterSpacing: '10px' }}
            />
            <button type="submit" style={{ marginLeft: '10px' }}>
                Verify
            </button>
            </form>
            {twoFAError && <p style={{ color: 'red' }}>{twoFAError}</p>}
        </div>
        );
    }

    // Default: show login form
    return (
        <div style={{ padding: '20px' }}>
        <h2>Login to Portfolio Analyzer</h2>
        <form onSubmit={handleLoginSubmit}>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@test.com"
            required
            style={{ display: 'block', margin: '10px 0', width: '300px' }}
            />
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ display: 'block', margin: '10px 0', width: '300px' }}
            />
            <button type="submit">Login</button>
        </form>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
        </div>
    );
    }

import {useState,useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

export default function Login (){
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const {login}=useContext(AuthContext);
    const navigate=useNavigate();

    const handleSubmit=async (e: React.FormEvent) => {
    e.preventDefault();
        try {
        await login(email, password);
        navigate('/dashboard'); // Redirect on success
        } catch (error) {
        alert('Login failed. Check your JPMC email and password.');
        }
    };

    return (
        <div style={{passign:'20px'}}>
            <h2> PortFolio Analyzer</h2>
            <form submit={handleSubmit}>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@test.com"
                required
                style={{ display: 'block', margin: '10px 0' }}
                />
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ display: 'block', margin: '10px 0' }}
                />
            <button type="submit">Login</button>
            </form>
        </div>
    )

}
    import React, { useState } from 'react';
    import axios from '../api';

    export default function PortfolioUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage('Please select a file');
        return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
        const res = await axios.post('/upload-csv', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        setMessage(res.data.message || 'Upload successful!');
        } catch (err) {
        setMessage(err.response?.data?.message || 'Upload failed.');
        }
    };

    return (
        <div className="container mt-4">
        <h3>Upload Portfolio CSV</h3>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button className="btn btn-primary mt-2" onClick={handleUpload}>
            Upload
        </button>
        <p className="mt-2">{message}</p>
        </div>
    );
    }
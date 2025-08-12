    import React, { useState } from 'react';
    import { uploadPortfolioCSV } from '../services/api';

    export default function PortfolioUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const MAX_FILE_SIZE_MB = 5; // example max size: 5MB

    const handleFileChange = (e) => {
        setMessage('');
        const selectedFile = e.target.files[0];

        if (selectedFile) {
        // Validate file extension
        if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
            setMessage('Only CSV files are allowed.');
            setFile(null);
            return;
        }

        // Validate file size
        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setMessage(`File size should be less than ${MAX_FILE_SIZE_MB} MB.`);
            setFile(null);
            return;
        }

        setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage('Please select a CSV file to upload.');
        return;
        }

        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
        const res = await uploadPortfolioCSV(formData);
        setMessage(res.data.message || 'Upload successful!');
        setFile(null); // Clear file after successful upload
        } catch (err) {
        const errorMsg =
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Upload failed.';
        setMessage(errorMsg);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
        <h3>Upload Portfolio CSV</h3>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
        className="btn btn-primary mt-2"
        onClick={handleUpload}
        disabled={loading}
        >
        {loading && <span className="spinner" aria-label="loading spinner"></span>}
        {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-2">{message}</p>}
        </div>
    );
    }

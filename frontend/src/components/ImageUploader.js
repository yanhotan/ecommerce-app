import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ onImageUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [localFilePath, setLocalFilePath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:8080/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(`Image uploaded successfully! File ID: ${response.data.fileId}`);
        if (onImageUploaded) {
          onImageUploaded(response.data.fileId, response.data.filename);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleLocalUpload = async () => {
    if (!localFilePath.trim()) {
      setError('Please enter a file path');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8080/api/images/upload-local', {
        filePath: localFilePath
      });

      if (response.data.success) {
        setSuccess(`Local image uploaded successfully! File ID: ${response.data.fileId}`);
        if (onImageUploaded) {
          onImageUploaded(response.data.fileId, response.data.filename);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to upload local image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Image Upload</h3>
      
      {/* File Upload */}
      <div style={styles.section}>
        <h4>Upload from Computer</h4>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={styles.fileInput}
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          style={styles.button}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {/* Local File Path Upload */}
      <div style={styles.section}>
        <h4>Upload Local File by Path</h4>
        <input
          type="text"
          placeholder="C:\path\to\your\image.png"
          value={localFilePath}
          onChange={(e) => setLocalFilePath(e.target.value)}
          style={styles.textInput}
        />
        <button
          onClick={handleLocalUpload}
          disabled={uploading || !localFilePath.trim()}
          style={styles.button}
        >
          {uploading ? 'Uploading...' : 'Upload Local File'}
        </button>
      </div>

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  title: {
    marginBottom: '15px',
    color: '#333',
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  fileInput: {
    marginBottom: '10px',
    display: 'block',
  },
  textInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#ee4d2d',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    padding: '10px',
    backgroundColor: '#e8f5e8',
    borderRadius: '4px',
    marginTop: '10px',
  },
};

export default ImageUploader;

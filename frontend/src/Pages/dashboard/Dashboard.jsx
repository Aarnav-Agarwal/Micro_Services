import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dash.css";
import api from "../../Services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchFiles();
  }, []);


  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };
  // for fetching the files from backend
  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // for accessing the file detail panel
  const handleFileClick = (id) => {
    navigate(`/file/${id}`);
  };
  // function for uploading
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (file.size > 50 * 1024 * 1024) {
      alert("Maximum file size is 50 MB");
      return;
    }
    try {
      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data);
      fetchFiles();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>My Files</h1>
        <p>Manage and access your uploaded files</p>
      </div>

      <div className="fileContainer">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="fileCard"
              onClick={() => handleFileClick(file.id)}
            >
              <div className="fileIcon">📄</div>
              <div className="fileInfo">
                <h3>{file.original_name}</h3>
                <p>
                  {file.mime_type} {" • "} {formatFileSize(file.size_bytes)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No files found</p>
        )}
      </div>

      {/* upload button */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button className="uploadBtn" onClick={handleUpload}>
        + Upload File
      </button>
    </div>
  );
}

export default Dashboard;

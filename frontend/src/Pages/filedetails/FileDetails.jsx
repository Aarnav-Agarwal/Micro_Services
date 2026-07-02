import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Services/api";
import "./FileDetails.css";

function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shareId, setShareId] = useState("");
  const [file, setFile] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDetails();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const numBytes = parseInt(bytes, 10);
    if (numBytes < 1024) {
      return `${numBytes} B`;
    }
    if (numBytes < 1024 * 1024) {
      return `${(numBytes / 1024).toFixed(2)} KB`;
    }
    if (numBytes < 1024 * 1024 * 1024) {
      return `${(numBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(numBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const fetchDetails = async () => {
    try {
      const response_a = await api.get(`/files/${id}`);
      if (response_a.data.success) {
        setFile(response_a.data.file);
      }

      try {
        const response_b = await api.get(`/shares/file/${id}`);
        if (response_b.data.success) {
          setSharedUsers(response_b.data.files);
        }
      } catch (err) {
        setSharedUsers([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const shareFile = async () => {
    if (!shareId.trim()) return;
    try {
      // Get the owner ID dynamically
      const o_id = file.owner_id;
      const response = await api.post(`/shares`, {
        file_id: id,
        shared_with_user_id: shareId,
        owner_id: o_id,
      });

      alert(response.data.message);
      fetchDetails();
      setShareId("");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const removeAccess = async (shareRecordId) => {
    try {
      await api.delete(`/shares/${shareRecordId}`);
      setSharedUsers(sharedUsers.filter((user) => user.id !== shareRecordId));
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await api.get(`/files/${id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.original_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async () => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/files/${id}`);
      alert("File deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data || error.message || "Failed to delete file");
    }
  };

  if (!file) {
    return <h2>Loading file details...</h2>;
  }

  return (
    <div className="detailsPage">
      <div className="detailsContainer">
        <div className="fileSection">
          <div className="fileIcon">📄</div>

          <h1>{file.original_name}</h1>

          <p>Size: {formatFileSize(file.size_bytes)}</p>

          <p>Uploaded: {new Date(file.created_at).toLocaleString()}</p>

          <button className="downloadBtn" onClick={downloadFile}>
            Download
          </button>

          {file.owner_id === loggedInUser.id && (
            <button className="deleteBtn" onClick={deleteFile}>
              Delete File
            </button>
          )}
        </div>

        <div className="shareSection">
          <h2>Share Management</h2>
          <div className="shareInput">
            <input
              value={shareId}
              onChange={(e) => setShareId(e.target.value)}
              placeholder="Enter user id"
            />

            <button onClick={shareFile}>Share</button>
          </div>
          <h3>Shared With</h3>
          {sharedUsers.length > 0 ? (
            sharedUsers.map((user) => (
              <div className="userCard" key={user.id}>
                <div>
                  <p>User_id: {user.shared_with_user_id}</p>
                </div>

                <button
                  className="removeBtn"
                  onClick={() => removeAccess(user.id)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Not shared with anyone</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileDetails;

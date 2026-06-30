import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/api";
import "./FileDetails.css";

function FileDetails() {
  const { id } = useParams();
  const [shareId, setShareId] = useState("");
  const [file, setFile] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);

  useEffect(() => {
    fetchDetails();
  }, []);

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
      console.log(error.response.data.message);
    }
  };

  const shareFile = async () => {
    const response_a = await api.get(`/files/${id}`);
    const o_id = response_a.data.file.owner_id;

    if (!shareId.trim()) return;
    try {
      const response = await api.post(`/shares`, {
        file_id: id,
        shared_with_user_id: shareId,
        owner_id: o_id,
      });

      alert(response.data.message);
      fetchDetails();
      setShareId("");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const removeAccess = async (userId) => {
    try {
      await api.delete(`/shares/${userId}`);
      setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await api.get(`/files/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  if (!file) {
    return <h2>No shares</h2>;
  }

  return (
    <div className="detailsPage">
      <div className="detailsContainer">
        <div className="fileSection">
          <div className="fileIcon">📄</div>

          <h1>{file.original_name}</h1>

          <p>Size: {file.size}</p>

          <p>Uploaded: {file.created_at}</p>

          <button className="downloadBtn" onClick={downloadFile}>
            Download
          </button>
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
                  {/* <strong>{user.name}</strong> */}
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

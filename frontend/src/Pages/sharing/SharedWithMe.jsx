import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SharedWithMe.css";
import api from "../../Services/api";

function SharedWithMe() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    sharedFiles();
  }, []);

  const sharedFiles = async () => {
    try {
      const response = await api.get("/shares/me");
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openFile = (id) => {
    navigate(`/file/${id}`);
  };

  return (
    <div className="sharedDashboard">
      <div className="sharedHeader">
        <div>
          <h1>Shared With Me</h1>
          <p>Files shared by other users</p>
        </div>

        <div className="sharedStats">
          <h3>{files.length}</h3>
          <p>Shared Files</p>
        </div>
      </div>

      <div className="sharedGrid">
        {files.map((file) => (
          <div
            key={file.id}
            className="sharedCard"
            onClick={() => openFile(file.id)}
          >
            <div className="sharedIcon">📁</div>
            <div className="sharedInfo">
              <h3>{file.name}</h3>
              {/* <p>
                {file.type}
                {" • "}
                {file.size}
              </p> */}
              <span>Shared by: {file.owner_id}</span>
              <small>{file.created_at}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SharedWithMe;
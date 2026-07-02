import pool from "../Models/file_db.js";
import path from "path";
import fs from "fs";

const download = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM files WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const file = result.rows[0];

        // Authorization 
        if (file.owner_id !== req.user.id) {
            try {
                const shareServiceUrl = process.env.SHARE_SERVICE_INTERNAL || 'http://localhost:4003/shares';
                const response = await fetch(`${shareServiceUrl}/file/${id}`, {
                    headers: { Authorization: req.headers.authorization }
                });
                if (response.ok) {
                    const data = await response.json();
                    const shares = data.files || [];
                    const isShared = shares.some(s => s.shared_with_user_id === req.user.id);
                    if (!isShared) {
                        return res.status(403).json({
                            success: false,
                            message: "Access Denied"
                        });
                    }
                } else {
                    return res.status(403).json({
                        success: false,
                        message: "Access Denied"
                    });
                }
            } catch (err) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }
        }

        const resolvedPath = path.resolve(file.stored_path);
        if (!fs.existsSync(resolvedPath)) {
            return res.status(404).json({
                success: false,
                message: "File physically missing"
            });
        }

        return res.download(resolvedPath, file.original_name);
    } catch (err) {
        console.error("Error downloading file:", err);
        return res.status(500).json({
            success: false,
            message: "Error downloading file"
        });
    }
};

export default download;

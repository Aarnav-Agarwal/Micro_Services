import pool from "../Models/share_db.js";

const allShares = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query("SELECT * FROM shares WHERE shared_with_user_id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: true,
                sharedWith: []
            });
        }

        const fileServiceUrl = process.env.FILE_SERVICE_INTERNAL || 'http://localhost:4002/files';
        const sharedFilesWithMeta = await Promise.all(result.rows.map(async (share) => {
            try {
                const response = await fetch(`${fileServiceUrl}/${share.file_id}`, {
                    headers: { Authorization: req.headers.authorization }
                });
                if (response.ok) {
                    const fileData = await response.json();
                    return {
                        ...share,
                        name: fileData.file.original_name,
                        size_bytes: fileData.file.size_bytes,
                        mime_type: fileData.file.mime_type,
                    };
                }
            } catch (err) {
                console.error(`Error fetching file metadata for file ${share.file_id}:`, err);
            }
            return {
                ...share,
                name: `File #${share.file_id} (Metadata unavailable)`,
                size_bytes: 0,
                mime_type: 'unknown'
            };
        }));

        return res.status(200).json({
            success: true,
            sharedWith: sharedFilesWithMeta
        });
    } catch (err) {
        console.log("Error in allShares controller:", err);
        return res.status(500).send("Error fetching share record");
    }
};

export default allShares;
import pool from "../Models/file_db.js";

const find = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT * FROM files WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const file = result.rows[0];

        // Authorization check
        if (file.owner_id != req.user.id) {
            try {
                const shareServiceUrl = process.env.SHARE_SERVICE_INTERNAL || 'http://localhost:4003/shares';
                const response = await fetch(`${shareServiceUrl}/file/${id}`, {
                    headers: { Authorization: req.headers.authorization }
                });
                if (response.ok) {
                    const data = await response.json();
                    const shares = data.files || [];
                    const isShared = shares.some(s => s.shared_with_user_id == req.user.id);
                    if (!isShared) {
                        return res.status(403).json({
                            success: false,
                            message: "you are not permitted to access the file"
                        });
                    }
                } else {
                    return res.status(403).json({
                        success: false,
                        message: "you are not permitted to access the file"
                    });
                }
            } catch (err) {
                return res.status(403).json({
                    success: false,
                    message: "you are not permitted to access the file"
                });
            }
        }

        return res.status(200).json({
            success: true,
            file: file
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching file"
        });
    }
};

export default find;
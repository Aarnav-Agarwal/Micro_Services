import pool from "../Models/share_db.js";

const share = async (req, res) => {
    try {
        const {
            file_id,
            shared_with_user_id,
            public_token,
            expires_at
        } = req.body;

        const owner_id = req.user.id; // Extract from auth token

        if (!file_id) {
            return res.status(400).json({
                success: false,
                message: "file_id is required"
            });
        }

        const fileServiceUrl = process.env.FILE_SERVICE_INTERNAL || 'http://localhost:4002/files';
        try {
            const fileResponse = await fetch(`${fileServiceUrl}/${file_id}`, {
                headers: { Authorization: req.headers.authorization }
            });

            if (!fileResponse.ok) {
                return res.status(404).json({
                    success: false,
                    message: "File not found or access denied"
                });
            }

            const fileData = await fileResponse.json();
            if (fileData.file.owner_id !== owner_id) {
                return res.status(403).json({
                    success: false,
                    message: "you do not own this file"
                });
            }
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).json({
                success: false,
                message: "Error in authentication"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO shares
            (
                file_id,
                owner_id,
                shared_with_user_id,
                public_token,
                expires_at
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                file_id,
                owner_id,
                shared_with_user_id ?? null,
                public_token ?? null,
                expires_at ?? null
            ]
        );

        return res.status(201).json({
            success: true,
            share: result.rows[0],
            message: "File shared"
        });

    }
    catch (err) {
        console.log("Error in sharing:", err);
        return res.status(500).json({
            success: false,
            message: "Error sharing"
        });
    }
};

export default share;
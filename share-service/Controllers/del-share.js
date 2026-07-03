import pool from "../Models/share_db.js";

const delshare = async (req, res) => {
    const shareId = await req.params.id;
    
    try {
        const shareCheck = await pool.query("SELECT * FROM shares WHERE id = $1", [shareId]);
        if (shareCheck.rows.length === 0) {
            return res.status(404).send("Share record not found");
        }
        const share = shareCheck.rows[0];
        
        // Query to check ownership
        if (share.owner_id != req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this share"
            });
        }

        const result = await pool.query("DELETE FROM shares WHERE id = $1 RETURNING *", [shareId]);
        res.status(200).json({
            success: true,
            deletedShare: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting share");
    }
};

export default delshare;
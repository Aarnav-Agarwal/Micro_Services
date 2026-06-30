import pool from "../Models/share_db.js";

const delshare = async (req, res) => {
    const shareId = await req.params.id;
    
    try {
        const result = await pool.query("DELETE FROM shares WHERE id = $1 RETURNING *", [shareId]);
        if (result.rows.length === 0) {
            return res.status(404).send("Share record not found");
        }
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
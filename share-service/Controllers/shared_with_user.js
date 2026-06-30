import pool from "../Models/share_db.js";

const allShares = async(req, res)=>{

    const user = req.user_id;
    try {
        const result = await pool.query("SELECT * FROM shares WHERE shared_with_user_id = $1", [user]);
        if (result.rows.length === 0) {
            return res.status(404).send("No share record");
        }
        res.status(200).json({
            success: true,
            sharedWith: result.rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching share record");
    }
}

export default allShares;
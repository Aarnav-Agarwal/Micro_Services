import pool from "../Models/share_db.js"

const share = async (req,res) => {
    const file_Id = req.params.file_id;
    try {
        const result = await pool.query("SELECT * FROM shares WHERE file_id = $1", [file_Id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No record found"
            });;
        }
        res.status(200).json({
            success:true,
            files: result.rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching share record");
    }
}

export default share;
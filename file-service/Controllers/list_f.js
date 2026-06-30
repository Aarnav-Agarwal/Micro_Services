import pool from "../Models/file_db.js";

const findall = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;
        const listquery ="SELECT * FROM files WHERE owner_id = $1";
        const result = await pool.query(listquery,[id]);
        console.log(result.rows);
        return res.status(200).json({
            success: true,
            files: result.rows
        });
    } catch (err){
        console.log("Error fetching data:", err);
        return res.status(500).json({
            success: false,
            message: "Error fetching files"
        });
    }
};

export default findall;
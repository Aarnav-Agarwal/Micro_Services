import pool from "../Models/file_db.js";
import fs from "fs/promises";

const delf = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const findquery = "SELECT * FROM files WHERE id = $1";
        const result = await pool.query(findquery, [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("File does not exist");
        }

        const file = result.rows[0];

        //check user
        if (file.owner_id !== userId) {
            return res.status(403).send("Access Denied");
        }

        //del fm disk
        try {
            await fs.unlink(file.stored_path);
        } catch (err) {
            console.log("Error deleting file from disk:", err);
        }
        
        //del from db
        const delquery = "DELETE FROM files WHERE id = $1";
        await pool.query(delquery, [id]);

        console.log("File record deleted successfully");
        return res.status(200).send("deleted");
    }
    catch (err) {
        console.error("Error during file deletion:", err);
        return res.status(500).send("Error deleting file");
    }
};

export default delf;

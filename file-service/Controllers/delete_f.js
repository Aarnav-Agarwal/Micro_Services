import pool from "../Models/file_db.js"
import fs from "fs/promises"


const delf = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const findquery = "SELECT * FROM files WHERE id= $1"
        await pool.query(findquery, [id], (err, result) => {
            if (err) {
                console.log('Error fetching data', err)
                res.status(500).send('Error fetching data')
            } else {
                if (result.rows.length===0) {
                    res.send("file does not exist")
                }
                else {
                 
                    const file = result.rows[0]
                    fs.unlink(file.stored_path);      //del from disk


                    const delquery = "DELETE FROM files WHERE id=$1 "
                    pool.query(delquery, [id], (err, result) => {
                        if (err) {
                            console.log('Error deleting data', err)
                            res.status(500).send('Error deleting data')
                        } else {
                            console.log(result.rows)
                            console.log("deleted")
                            res.status(200).send(deleted)
                        }
                    })
                }

            }

        })

    }
    catch (err) {
        console.log("error")
    }
}

export default delf;

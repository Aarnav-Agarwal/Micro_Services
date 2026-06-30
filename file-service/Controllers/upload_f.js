import db from '../Models/file_db.js';

const uploadd = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const id= req.user.id;
  const { name, age } = req.body
  const { fieldname, originalname, encoding, mimetype, path, destination, filename, size } = req.file;

  const inputquery = "INSERT INTO files(owner_id, original_name, stored_path, size_bytes, mime_type) VALUES($1, $2, $3, $4, $5)"

  db.query(inputquery, [id, originalname, path, size, mimetype], (err, result) => {
    if (err) {
      console.log('Error inserting data', err)
      res.status(500).send('Error inserting data')
    } else {
      // console.log(result)
      res.status(201).send('Data inserted successfully')

    }
  })

}

export default uploadd;

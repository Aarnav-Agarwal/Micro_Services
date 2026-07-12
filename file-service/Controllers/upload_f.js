import crypto from 'crypto';
import path from 'path';
import db from '../Models/file_db.js';
import { minioClient, BUCKET_NAME } from '../Config/minio.js';

const uploadd = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const id = req.user.id;
    const { originalname, mimetype, size, buffer } = req.file;

    // generating a unique object key
    const randomHex = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(originalname);
    const objectKey = `${id}/${randomHex}${ext}`;

    // Uploading to minio
    await minioClient.putObject(BUCKET_NAME, objectKey, buffer, size, {
      'Content-Type': mimetype,
    });

    // to tore in db
    const inputquery = "INSERT INTO files(owner_id, original_name, object_key, size_bytes, mime_type) VALUES($1, $2, $3, $4, $5)";
    await db.query(inputquery, [id, originalname, objectKey, size, mimetype]);

    res.status(201).send('Data inserted successfully');
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Error uploading file');
  }
};

export default uploadd;

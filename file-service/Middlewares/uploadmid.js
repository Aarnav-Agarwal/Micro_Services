import multer from 'multer';

// file buffer held in req.file.buffer for MinIO upload
const upload = multer({ storage: multer.memoryStorage(),});

export default upload;

import express from "express";
import uploadd from "../Controllers/upload_f.js";
const Router = express.Router();

import upload from "../Middlewares/uploadmid.js";
import del from "../Controllers/delete_f.js";
import search from "../Controllers/search_f.js";
import listall from "../Controllers/list_f.js";
import download from "../Controllers/download_f.js";

Router.get('/', listall);             // all files uploaded by that user

Router.post('/upload', upload.single('file'), uploadd);     // uploading a file

Router.get('/:id', search);     // search by id 

Router.get('/:id/download', download); // download file

Router.delete('/:id', del);    // del by file id

export default Router;
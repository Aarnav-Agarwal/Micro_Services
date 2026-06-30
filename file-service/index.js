import express from "express";
import cors from "cors";
import db from "./Models/file_db.js";
import fileRoutes from "./Routes/file_routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import auth from "./Middlewares/authenticate.js"


dotenv.config({ path: "../.env.shared" });
dotenv.config({ path: "./.env" });


const PORT = process.env.PORT || 4002;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use('/files',auth, fileRoutes);


app.listen(PORT, () => {
  console.log(`File Service is running on port ${PORT}`);
});
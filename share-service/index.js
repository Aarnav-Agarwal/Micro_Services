import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./Models/share_db.js";
import route from "./Routes/share_routes.js";
import auth from "./Middlewares/authenticate.js"


dotenv.config({ path: "../.env.shared" });
dotenv.config({ path: "./.env" });

const app = express();
app.use(cors())
app.use(express.json());


app.use('/shares',auth, route);


const PORT = process.env.PORT || 4003;
app.listen(PORT,()=>{
    console.log(`share Service is running on port ${PORT}`);
});


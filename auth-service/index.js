import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './Routes/auth_router.js';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import db from "./Models/auth_db.js";


dotenv.config({ path: "../.env.shared" });
dotenv.config({ path: "./.env" });


const app= express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT,()=>{
    console.log(`Auth Service is running on port ${PORT}`);
});

export default app;
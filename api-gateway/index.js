import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config({ path: "../.env.shared" });
dotenv.config({ path: "./.env" });

import verifyToken from  "./middleware/authWare.js";
import { createProxyMiddleware }  from "http-proxy-middleware";

const app = express();

app.use(cors());

app.use(
  "/api/auth",                                  //localhost:8080/api/auth  then it routes to localhost:4001/auth 
  createProxyMiddleware({                       // when process.env.AUTH_SERVICE=http://localhost:4001/auth
    target: process.env.AUTH_SERVICE,           //if AUTH_SERVICE=http://localhost:4001 then routes o localhost:4001/
    changeOrigin: true
  })
);

// app.use(express.json());  needed if gateway needs to access the data else it eats up the req format

app.use(
  "/api/files",
  verifyToken,
  createProxyMiddleware({
    target: process.env.FILE_SERVICE,
    changeOrigin: true
  })
);

app.use(
  "/api/shares",
  verifyToken,
  createProxyMiddleware({
    target: process.env.SHARE_SERVICE,
    changeOrigin: true
  })
);


app.get("/", (req, res) => {
  res.json({
    status: "API Gateway Running"
  });
});


app.listen(process.env.PORT, () => {
  console.log(
    `Gateway running on port ${process.env.PORT}`
  );
});
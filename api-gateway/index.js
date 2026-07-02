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
  "/api/auth",                                   
  createProxyMiddleware({                       
    target: process.env.AUTH_SERVICE,           
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": ""
    }
  })
);

app.use(
  "/api/files",
  verifyToken,
  createProxyMiddleware({
    target: process.env.FILE_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/files": ""
    }
  })
);

app.use(
  "/api/shares",
  verifyToken,
  createProxyMiddleware({
    target: process.env.SHARE_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/shares": ""
    }
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
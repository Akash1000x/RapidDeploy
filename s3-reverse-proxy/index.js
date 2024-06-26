const express = require("express");
const httpProxy = require("http-proxy");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 8000;

// S3 Bucket Base Path
const BASE_PATH = process.env.S3_BUCKET_BASE_PATH;

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));

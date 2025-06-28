const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const constants = require("./config/constants");

const app = express();

console.time("gateway-boot");

const proxyUsersMiddleware = createProxyMiddleware({
  target: "http://127.0.0.1:5000",
  changeOrigin: true,
});

// Proxy to Service User (port 5000)
app.use(
  "/v1/auth",
  createProxyMiddleware({
    target: "http://127.0.0.1:5000/v1/auth",
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use(
  "/v1/users",
  createProxyMiddleware({
    target: "http://127.0.0.1:5000/v1/users",
    changeOrigin: true,
    logLevel: "debug",
  })
);

// Proxy to Service Company (port 4000)
app.use(
  "/v1/company",
  createProxyMiddleware({
    target: "http://127.0.0.1:4000/v1/company",
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use(
  "/v1/jobs",
  createProxyMiddleware({
    target: "http://127.0.0.1:4000/v1/jobs",
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.get("/", (req, res) => {
  res.json({ message: "API Gateway berjalan di Port 3000" });
});

const PORT = constants.PORT;
app.listen(PORT, () => {
  console.timeEnd("gateway-boot");
  console.log(`Service Gateway is running on http://localhost:${PORT}`);
});

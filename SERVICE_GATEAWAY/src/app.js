console.time("gateway-boot");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const constants = require("./config/constants");

const app = express();

app.use(express.json());

// Proxy ke Service User (port 5000)
app.use(
  "/v1/auth",
  createProxyMiddleware({
    target: "http://127.0.0.1:5000/v1/auth",
    changeOrigin: true,
  })
);

app.use(
  "/v1/users",
  createProxyMiddleware({
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
  })
);

// Proxy ke Service Company (port 4000)
app.use(
  "/v1/company",
  createProxyMiddleware({
    target: "http://127.0.0.1:4000",
    changeOrigin: true,
  })
);

app.use(
  "/v1/jobs",
  createProxyMiddleware({
    target: "http://127.0.0.1:4000",
    changeOrigin: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway berjalan di Port 3000");
});

const PORT = constants.PORT;
app.listen(PORT, () => {
  console.timeEnd("gateway-boot");
  console.log(`Service Gateaway is running on http://localhost:${PORT}`);
});

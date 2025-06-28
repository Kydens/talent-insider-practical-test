module.exports = {
  apps: [
    {
      name: "service_users",
      script: "src/app.js",
      cwd: "./SERVICE_USERS",
      watch: ["src"],
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
    },
    {
      name: "service_company",
      script: "src/app.js",
      cwd: "./SERVICE_COMPANY",
      watch: ["src"],
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
    },
    {
      name: "gateway",
      script: "src/app.js",
      cwd: "./SERVICE_GATEWAY",
      watch: ["src"],
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
    },
  ],
};

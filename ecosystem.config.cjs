module.exports = {
  apps: [
    {
      name: "youtube-api",
      script: "./src/index.js",
      instances: "max",       
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "youtube-workers",
      script: "./src/workers.js",
      instances: 1,
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
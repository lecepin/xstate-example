const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // 代理 /api 的请求
    proxy({
      target: "http://localhost:4000",
      logLevel: "debug",
      changeOrigin: true,
    })
  );
};

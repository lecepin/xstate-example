const http = require("http");
const PORT = 4000;

http
  .createServer(function ({ method, url }, res) {
    const { searchParams, pathname } = new URL(url, `http://localhost:${PORT}`);

    if (pathname == "/api/feedback") {
      return setTimeout(
        () =>
          res.end(
            JSON.stringify({
              success: false,
            })
          ),
        3000
      );
    }

    if (pathname == "/api/status") {
      // return res.end();
      return setTimeout(
        () =>
          res.end(
            JSON.stringify({
              submitted: true,
            })
          ),
        1000
      );
    }
  })
  .listen(PORT);

import { createServer } from "miragejs";

createServer({
  routes() {
    this.namespace = "api";

    this.post(
      "/submit",
      (_, req) => {
        console.log(req.requestBody);

        if (Math.random() < 0.5) {
          return {
            success: false,
            errorMsg: "提交失败，请重试",
          };
        }

        return {
          success: true,
        };
      },
      { timing: 1000 }
    );

    this.passthrough((req) => {
      return req.url.indexOf(this.namespace) == -1;
    });
  },
});

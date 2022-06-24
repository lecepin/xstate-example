import { createMachine } from "xstate";

export default createMachine(
  {
    id: "年度产品使用建议反馈",
    initial: "录入反馈",
    states: {
      录入反馈: {
        on: {
          e_提交: "提交反馈",
        },
      },
      提交反馈: {
        invoke: {
          src: "invoke_提交反馈",
        },
        on: {
          e_提交成功: "提交成功",
          e_提交失败: "提交失败",
        },
      },
      提交失败: {
        on: {
          e_提交: "提交反馈",
        },
      },
      提交成功: {},
    },
  },
  {
    services: {
      invoke_提交反馈:
        (ctx, { value }) =>
        (send) => {
          fetch(`/api/feedback?content=${value}`)
            .then((data) => data.json())
            .then((data) => {
              data?.success ? send("e_提交成功") : send("e_提交失败");
            })
            .catch(() => {
              send("e_提交失败");
            });
        },
    },
  }
);

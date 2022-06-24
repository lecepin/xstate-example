import { createMachine } from "xstate";

export default createMachine(
  {
    id: "年度产品使用建议反馈",
    initial: "反馈状态",
    states: {
      反馈状态: {
        invoke: {
          src: "invoke_反馈状态",
        },
        on: {
          e_获取成功: [
            { target: "提交成功", cond: "cond_isSubmitted" },
            { target: "录入反馈" },
          ],
          e_获取失败: "获取失败",
        },
      },
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
      获取失败: {},
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
      invoke_反馈状态: () => (send) => {
        fetch(`/api/status`)
          .then((data) => data.json())
          .then(({ submitted }) => {
            send({ type: "e_获取成功", submitted });
          })
          .catch(() => {
            send("e_获取失败");
          });
      },
    },
    guards: {
      cond_isSubmitted: (ctx, { submitted }) => {
        return submitted;
      },
    },
  }
);

import { createMachine, actions } from "xstate";

const feddbackMachine = createMachine(
  {
    id: "反馈建议",
    initial: "不显示",
    context: {
      score: 0,
      selectModule: [],
      suggest: "",
      errorMsg: "",
    },
    states: {
      不显示: {
        onEntry: "doInitContext",
        on: {
          打开: {
            target: "#反馈建议.显示",
          },
        },
      },
      显示: {
        initial: "评分",
        states: {
          评分: {
            initial: "评分",
            states: {
              评分: {
                onExit: "doClearErrorMsg",
                on: {
                  值改变: {
                    actions: "doScoreChange",
                  },
                  下一步: [
                    {
                      cond: "isLess",
                      target: "#反馈建议.显示.评分.关注功能.不满意",
                    },
                    {
                      cond: "isMore",
                      target: "#反馈建议.显示.评分.关注功能.满意",
                    },
                    {
                      cond: "isEqual",
                      target: "#反馈建议.显示.建议",
                    },
                    { actions: "doNoScore" },
                  ],
                },
              },

              关注功能: {
                on: {
                  上一步: {
                    target: "#反馈建议.显示.评分.评分",
                  },
                  下一步: {
                    target: "#反馈建议.显示.建议",
                  },
                  值改变: {
                    actions: "doSelectChange",
                  },
                },
                states: {
                  不满意: {},
                  满意: {},
                },
              },
              上个步骤: {
                type: "history",
                history: "deep",
              },
            },
          },
          建议: {
            onExit: "doClearErrorMsg",
            on: {
              上一步: {
                target: "#反馈建议.显示.评分.上个步骤",
              },
              提交: {
                target: "#反馈建议.显示.提交中",
              },
              值改变: {
                actions: "doSuggestChange",
              },
            },
          },
          提交中: {
            invoke: {
              id: "serviceSubmit",
              src: "serviceSubmit",
              onDone: {
                target: "#反馈建议.显示.结束",
              },
              onError: {
                target: "#反馈建议.显示.建议",
                actions: "doSubmitFail",
              },
            },
          },
          结束: {
            after: {
              2000: {
                target: "#反馈建议.不显示",
              },
            },
          },
        },
        on: {
          关闭: {
            target: "#反馈建议.不显示",
          },
        },
      },
    },
  },
  {
    guards: {
      isLess: (ctx) => ctx.score < 3 && ctx.score > 0,
      isMore: (ctx) => ctx.score > 3,
      isEqual: (ctx) => ctx.score == 3,
    },
    actions: {
      doScoreChange: actions.assign({
        score: (ctx, e) => e.value,
      }),
      doSelectChange: actions.assign({
        selectModule: (ctx, e) => e.value,
      }),
      doSuggestChange: actions.assign({
        suggest: (ctx, e) => e.value,
      }),
      doNoScore: actions.assign({
        errorMsg: "请完成此项评价",
      }),
      doSubmitFail: actions.assign({
        errorMsg: (ctx, e) => e.data,
      }),
      doClearErrorMsg: actions.assign({
        errorMsg: "",
      }),
      doInitContext: actions.assign({
        score: 0,
        selectModule: [],
        suggest: "",
        errorMsg: "",
      }),
    },
    services: {
      serviceSubmit: ({ score, selectModule, suggest }) =>
        fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify({ score, selectModule, suggest }),
        })
          .then((data) => data.json())
          .then((data) => {
            if (!data.success) {
              return Promise.reject(data.errorMsg);
            }
          }),
    },
  }
);

export { feddbackMachine };

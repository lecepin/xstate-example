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
            on: {
              上一步: {
                target: "#反馈建议.显示.评分.评分",
              },
            },

            states: {
              评分: {
                onExit: "doClearErrorMsg",
                on: {
                  下一步: [
                    {
                      cond: "isLess",
                      target: "#反馈建议.显示.评分.不满意",
                    },
                    {
                      cond: "isMore",
                      target: "#反馈建议.显示.评分.满意",
                    },
                    {
                      cond: "isEqual",
                      target: "#反馈建议.显示.建议",
                    },
                    { actions: "doNoScore" },
                  ],
                },
              },

              不满意: {
                on: {
                  下一步: {
                    target: "#反馈建议.显示.建议",
                  },
                },
              },
              满意: {
                on: {
                  下一步: {
                    target: "#反馈建议.显示.建议",
                  },
                },
              },
              上个步骤: {
                type: "history",
                history: "shallow",
              },
            },
          },
          建议: {
            on: {
              上一步: {
                target: "#反馈建议.显示.评分.上个步骤",
              },
              提交: {
                target: "#反馈建议.显示.提交中",
              },
            },
          },
          提交中: {
            invoke: {
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
      isLess: () => false,
      isMore: () => false,
      isEqual: () => true,
    },
    actions: {
      doNoScore: actions.assign({
        errorMsg: "请完成此项评价",
      }),
      doSubmitFail: actions.assign({
        errorMsg: "提交失败，请重试",
      }),
      doSaveScore: actions.assign({}),
      doClearErrorMsg: actions.assign({
        errorMsg: "",
      }),
    },
  }
);

export { feddbackMachine };

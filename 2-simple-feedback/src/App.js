import { useRef } from "react";
import { useMachine } from "@xstate/react";
import { Typography, Input, Button, Alert, Result, Spin } from "antd";
import { isDebugFsm } from "./utils";
import fsm from "./fsm.js";

import "./styles.css";

export default function App() {
  const [state, send] = useMachine(fsm, { devTools: isDebugFsm() });
  const inputRef = useRef();

  return (
    <div className="App">
      <Typography.Title level={4}>年度产品使用建议反馈</Typography.Title>

      {state.matches("反馈状态") ? <Spin tip="加载中"></Spin> : null}

      {["录入反馈", "提交反馈", "提交失败"].some(state.matches) ? (
        <>
          <Input.TextArea
            disabled={state.matches("提交反馈")}
            ref={inputRef}
            placeholder="请输入建议"
            rows={5}
          ></Input.TextArea>

          {state.matches("提交失败") ? (
            <Alert
              message="这提交失败，请重试"
              type="error"
              showIcon
              closable
            />
          ) : null}

          <Button
            type="primary"
            onClick={() => {
              const value = inputRef.current.resizableTextArea.textArea.value;
              send({ type: "e_提交", value });
            }}
            loading={state.matches("提交反馈")}
          >
            提交
          </Button>
        </>
      ) : null}

      {state.matches("提交成功") ? (
        <>
          <Result status="success" subTitle="已提交建议" />
        </>
      ) : null}

      {state.matches("获取失败") ? (
        <Alert message="接口异常，请刷新页面重试" type="error" showIcon />
      ) : null}
    </div>
  );
}

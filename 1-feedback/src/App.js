import { useMachine } from "@xstate/react";
import {
  Modal,
  Button,
  Typography,
  Rate,
  Checkbox,
  Input,
  Spin,
  Divider,
  Avatar,
} from "antd";
import { feddbackMachine } from "./fsm";

import "./styles.css";

export default function App() {
  const [state, send] = useMachine(feddbackMachine, { devTools: true });
  const { score, errorMsg, selectModule, suggest } = state.context;

  return (
    <div className="App">
      {state.matches("不显示") ? (
        <Avatar
          className="App-feedback-btn"
          size={50}
          onClick={() => send("打开")}
        >
          反馈
        </Avatar>
      ) : null}

      <Modal
        visible={state.matches("显示")}
        title="反馈与建议"
        footer={false}
        onCancel={() => send("关闭")}
        mask={false}
        className="App-feedback-modal"
        wrapClassName="App-feedback-modal-wrap"
      >
        {state.matches("显示.步骤记录.评分") ? (
          <>
            <Typography.Paragraph>你对此系统是否满意？</Typography.Paragraph>
            <Typography.Text type="secondary">不满意</Typography.Text>
            <Rate
              value={score}
              onChange={(value) => send("值改变", { value })}
            />
            <Typography.Text type="secondary">十分满意</Typography.Text>
          </>
        ) : null}

        {state.matches("显示.步骤记录.关注功能.不满意") ? (
          <Typography.Paragraph>你最不满意的有哪些功能？</Typography.Paragraph>
        ) : null}

        {state.matches("显示.步骤记录.关注功能.满意") ? (
          <Typography.Paragraph>你最满意的有哪些功能？</Typography.Paragraph>
        ) : null}

        {state.matches("显示.步骤记录.关注功能") ? (
          <Checkbox.Group
            value={selectModule}
            options={[
              {
                label: "功能A",
                value: "A",
              },
              {
                label: "功能B",
                value: "B",
              },
              {
                label: "功能C",
                value: "C",
              },
              {
                label: "功能D",
                value: "D",
              },
              {
                label: "功能E",
                value: "E",
              },
            ]}
            onChange={(value) => send("值改变", { value })}
          />
        ) : null}

        {state.matches("显示.建议") ? (
          <>
            <Typography.Paragraph>您是否有其他建议？</Typography.Paragraph>
            <Input.TextArea
              placeholder="请输入"
              value={suggest}
              onChange={(e) => send("值改变", { value: e.target.value })}
            ></Input.TextArea>
          </>
        ) : null}

        {state.matches("显示.提交中") ? (
          <div className="App-center">
            <Spin size="large" tip="提交中…" />
          </div>
        ) : null}

        {state.matches("显示.结束") ? (
          <div className="App-center">
            <img src="./bixin.png" />
            <Typography.Paragraph type="secondary">
              感谢您的反馈，2秒后自动关闭窗口{" "}
            </Typography.Paragraph>
          </div>
        ) : null}

        {errorMsg ? (
          <Typography.Paragraph type="danger">{errorMsg}</Typography.Paragraph>
        ) : null}

        <Divider />

        <div className="App-feedback-modal-footer">
          {["显示.建议", "显示.步骤记录.关注功能"].some(state.matches) ? (
            <Button style={{ marginRight: 12 }} onClick={() => send("上一步")}>
              上一步
            </Button>
          ) : null}

          {state.matches("显示.步骤记录") ? (
            <Button onClick={() => send("下一步")}>下一步</Button>
          ) : null}

          {state.matches("显示.建议") ? (
            <Button type="primary" onClick={() => send("提交")}>
              提交
            </Button>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

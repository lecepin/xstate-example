import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Split from "split.js";
import { inspect } from "@xstate/inspect";
import { isDebugFsm } from "./utils";
import App from "./App";

import "antd/dist/antd.css";
import "./index.css";

if (isDebugFsm()) {
  inspect({
    iframe: document.getElementById("xstate-inspect"),
    url: "https://apis.leping.fun/viz?inspect&panel=false",
  });

  Split(["#xstate-inspect", "#root"], { minSize: 0, sizes: [35, 65] });
} else {
  const root = document.createElement("div");

  document.querySelector(".split")?.remove?.();
  root.id = "root";
  document.body.appendChild(root);
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

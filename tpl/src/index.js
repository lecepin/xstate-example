import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Split from "split.js";
import { inspect } from "@xstate/inspect";

import App from "./App";
import "./index.css";

inspect({
  iframe: document.getElementById("xstate-inspect"),
  url: "https://stately.ai/viz?inspect",
});

Split(["#xstate-inspect", "#root"], { minSize: 0 });

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
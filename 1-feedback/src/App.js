import { useMachine } from "@xstate/react";
import { feddbackMachine } from "./fsm";

import "./styles.css";

export default function App() {
  const [state, send] = useMachine(feddbackMachine, { devTools: true });
  const { score, errorMsg, selectModule, suggest } = state.context;

  return (
    <button onClick={() => send("TOGGLE")}>
      {state.value === "inactive"
        ? "Click to activate"
        : "Active! Click to deactivate"}
    </button>
  );
}

import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";

import "./styles.css";

const toggleMachine = createMachine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" },
    },
    active: {
      on: { TOGGLE: "inactive" },
    },
  },
});

export default function App() {
  const [state, send] = useMachine(toggleMachine, { devTools: true });

  return (
    <button onClick={() => send("TOGGLE")}>
      {state.value === "inactive"
        ? "Click to activate"
        : "Active! Click to deactivate"}
    </button>
  );
}

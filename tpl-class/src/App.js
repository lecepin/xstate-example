import React from "react";
import { createMachine, interpret } from "xstate";

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

export default class App extends React.Component {
  state = {
    current: toggleMachine.initialState,
  };

  service = interpret(toggleMachine, { devTools: true }).onTransition(
    (current) => this.setState({ current })
  );

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }
  render() {
    const { current } = this.state;
    const { send } = this.service;

    return (
      <button onClick={() => send("TOGGLE")}>
        {current.value === "inactive"
          ? "Click to activate"
          : "Active! Click to deactivate"}
      </button>
    );
  }
}

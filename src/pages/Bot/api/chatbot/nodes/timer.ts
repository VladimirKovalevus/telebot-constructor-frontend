import { ClassicPreset } from "rete";
import { ActionSocket, TextSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "../types";

export class Timer extends ClassicPreset.Node<
  {
    exec: ClassicPreset.Socket;
    text: ClassicPreset.Socket;
  },
  {
    command: ClassicPreset.Socket;
    cancel: ClassicPreset.Socket;
  },
  { time: ClassicPreset.InputControl<"text"> }
> {
  width = 180;
  height = 100 + "%";

  constructor(
    initial: string,
    private dataflow: DataflowEngine<Schemes>,
  ) {
    super("Timer");
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), "Action"),
    );
    this.addInput("text", new ClassicPreset.Input(new TextSocket(), "Text"));
    this.addControl(
      "time",
      new ClassicPreset.InputControl("text", { initial }),
    );
    this.addOutput(
      "command",
      new ClassicPreset.Output(new ActionSocket(), "Command"),
    );
  }

  private timers: Map<number, NodeJS.Timeout> = new Map();

  async execute(_: never, forward: (output: "command") => void) {
    const data = await this.dataflow.fetchInputs(this.id);
    const text = (data.text && data.text[0]) || "";

    const cancelCommandMatch = text.match(/^\/cancel (\d+)$/);
    if (cancelCommandMatch) {
      const timerIdToCancel = Number(cancelCommandMatch[1]);
      this.cancelTimer(timerIdToCancel);
      return;
    }

    const time = this.controls.time.value;
    const timerId = Date.now();
    const timeoutId = setTimeout(() => {
      forward("command");
      this.timers.delete(timerId);
    }, Number(time));

    this.timers.set(timerId, timeoutId);
    console.log(
      `Setting timer with ID: ${timerId} in ${time}ms; Message: ${text};`,
    );
  }

  cancelTimer = (timerId: number) => {
    const timeoutId = this.timers.get(timerId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timers.delete(timerId);
      console.log(`Timer with ID: ${timerId} has been cancelled.`);
    } else {
      console.error(
        `Timer with ID: ${timerId} does not exist or has already been cancelled.`,
      );
    }
  };

  data() {
    return {};
  }
}

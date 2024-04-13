import { ClassicPreset } from "rete";
import { ActionSocket, TextSocket, UserSocket } from "../sockets";
import { DataflowEngine } from "rete-engine";
import { Schemes } from "../types";

export class OnCommand extends ClassicPreset.Node<
  {
    exec: ClassicPreset.Socket;
    text: ClassicPreset.Socket;
    user: ClassicPreset.Socket;
  },
  { consequent: ClassicPreset.Socket; alternate: ClassicPreset.Socket },
  { regexp: ClassicPreset.InputControl<"text"> }
> {
  width = 180;
  height = 100 + "%";

  constructor(
    initial: string,
    private dataflow: DataflowEngine<Schemes>,
  ) {
    super("On сommand");
    this.addInput(
      "exec",
      new ClassicPreset.Input(new ActionSocket(), "Action"),
    );
    this.addInput("text", new ClassicPreset.Input(new TextSocket(), "Text"));
    this.addInput("user", new ClassicPreset.Input(new UserSocket(), "User"));
    this.addControl(
      "regexp",
      new ClassicPreset.InputControl("text", { initial }),
    );
    this.addOutput(
      "consequent",
      new ClassicPreset.Output(new ActionSocket(), "Command"),
    );
  }

  async execute(
    _: never,
    forward: (output: "consequent" | "alternate") => void,
  ) {
    const data = await this.dataflow.fetchInputs(this.id);
    const text = (data.text && data.text[0]) || "";
    const regexpStr = this.controls.regexp.value;

    if (!text || !regexpStr) return;

    if (text.match(new RegExp(regexpStr, "gi"))) {
      forward("consequent");
    } else {
      forward("alternate");
    }
  }

  data() {
    return {};
  }
}

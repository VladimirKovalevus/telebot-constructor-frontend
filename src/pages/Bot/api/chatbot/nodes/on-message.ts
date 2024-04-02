import { ClassicPreset } from "rete";
import { ActionSocket, TextSocket, UserSocket } from "../sockets";

export class OnMessage extends ClassicPreset.Node<
  object,
  {
    exec: ClassicPreset.Socket;
    text: ClassicPreset.Socket;
    user: ClassicPreset.Socket;
  },
  object
> {
  width = 180;
  height = 100 + "%";
  inputMessage?: string;
  userId?: number;

  constructor() {
    super("On message");
    this.addOutput(
      "exec",
      new ClassicPreset.Output(new ActionSocket(), "Exec"),
    );
    this.addOutput("text", new ClassicPreset.Output(new TextSocket(), "Text"));
    this.addOutput("user", new ClassicPreset.Output(new UserSocket(), "User"));
  }

  execute(_: never, forward: (output: "exec") => void) {
    forward("exec");
  }

  data() {
    return {
      text: this.inputMessage || "",
      user: this.userId || 0,
    };
  }
}

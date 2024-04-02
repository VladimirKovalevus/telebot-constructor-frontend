import { ClassicPreset } from "rete";

export class ActionSocket extends ClassicPreset.Socket {
  constructor() {
    super("Action");
  }

  isCompatibleWith(socket: ClassicPreset.Socket) {
    return socket instanceof ActionSocket;
  }
}

export class TextSocket extends ClassicPreset.Socket {
  constructor() {
    super("Text");
  }

  isCompatibleWith(socket: ClassicPreset.Socket) {
    return socket instanceof TextSocket;
  }
}

export class UserSocket extends ClassicPreset.Socket {
  constructor() {
    super("User");
  }

  isCompatibleWith(socket: ClassicPreset.Socket) {
    return socket instanceof UserSocket;
  }
}

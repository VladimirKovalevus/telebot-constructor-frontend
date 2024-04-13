import { GetSchemes } from "rete";
import { Connection } from "./connection";
import {
  DebugChat,
  MatchMessage,
  Message,
  OnCommand,
  OnMessage,
  SendMessage,
  Timer,
} from "./nodes";

export type NodeProps =
  | DebugChat
  | MatchMessage
  | Message
  | OnCommand
  | OnMessage
  | SendMessage
  | Timer;
export type ConnProps =
  | Connection<OnMessage, MatchMessage>
  | Connection<Message, SendMessage>
  | Connection<MatchMessage, SendMessage>
  | Connection<OnCommand, SendMessage>;

export type Schemes = GetSchemes<NodeProps, ConnProps>;

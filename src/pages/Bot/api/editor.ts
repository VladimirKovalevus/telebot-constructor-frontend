import { createRoot } from "react-dom/client";
import { NodeEditor } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ClassicFlow,
  ConnectionPlugin,
  getSourceTarget,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ExpectedSchemes,
} from "rete-auto-arrange-plugin";
import { DataflowEngine, ControlFlowEngine } from "rete-engine";
import {
  ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
} from "rete-context-menu-plugin";
import {
  DebugChat,
  Message,
  OnMessage,
  OnCommand,
  MatchMessage,
  SendMessage,
  Timer,
} from "./chatbot/nodes";
import { ActionSocket, TextSocket, UserSocket } from "./chatbot/sockets";
import { Schemes } from "./chatbot/types";
import { Connection } from "./chatbot/connection";
import { ActionSocketComponent } from "./chatbot/ui/ActionSocket";
import { TextSocketComponent } from "./chatbot/ui/TextSocket";
import { ActionConnectionComponent } from "./chatbot/ui/ActionConnection";
import { TextConnectionComponent } from "./chatbot/ui/TextConnection";
import { ChatNodeComponent } from "./chatbot/ui/Chat";
import { CustomNodeComponent } from "./chatbot/ui/CustomNode";
import { getConnectionSockets } from "./chatbot/utils";
import { addCustomBackground } from "./chatbot/ui/background";
import * as ContextMenuComponents from "./chatbot/ui/context-menu";
import { UserSocketComponent } from "./chatbot/ui/UserSocket";

type AreaExtra = ReactArea2D<never> | ContextMenuExtra;

export async function createEditor(
  container: HTMLElement,
  log: (text: string, type: "info" | "error") => void,
) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
  const arrange: AutoArrangePlugin<ExpectedSchemes, AreaExtra> =
    new AutoArrangePlugin<ExpectedSchemes, AreaExtra>();
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof TextSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof TextSocket)
          .map(([name]) => name),
    };
  });
  const engine = new ControlFlowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () =>
        Object.entries(inputs)
          .filter(([_, input]) => input.socket instanceof ActionSocket)
          .map(([name]) => name),
      outputs: () =>
        Object.entries(outputs)
          .filter(([_, output]) => output.socket instanceof ActionSocket)
          .map(([name]) => name),
    };
  });
  function respond(text: string) {
    setTimeout(() => {
      chat.botSend(text);
    }, 500);
  }
  const contextMenu = new ContextMenuPlugin<Schemes>({
    items: ContextMenuPresets.classic.setup([
      ["Match message", () => new MatchMessage("", dataflow)],
      ["Message", () => new Message("")],
      ["On command", () => new OnCommand("", dataflow)],
      ["On message", () => new OnMessage()],
      ["Send message", () => new SendMessage(dataflow, respond)],
      ["Timer", () => new Timer("0", dataflow)],
    ]),
  });
  area.use(contextMenu);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(
    Presets.contextMenu.setup({
      customize: {
        main: () => ContextMenuComponents.Menu,
        item: () => ContextMenuComponents.Item,
        common: () => ContextMenuComponents.Common,
        search: () => ContextMenuComponents.Search,
        subitems: () => ContextMenuComponents.Subitems,
      },
    }),
  );
  render.addPreset(
    Presets.classic.setup({
      customize: {
        connection(data) {
          const { source, target } = getConnectionSockets(editor, data.payload);

          if (
            source instanceof ActionSocket ||
            target instanceof ActionSocket
          ) {
            return ActionConnectionComponent;
          }
          return TextConnectionComponent;
        },
        socket(data) {
          if (data.payload instanceof ActionSocket) {
            return ActionSocketComponent;
          }
          if (data.payload instanceof TextSocket) {
            return TextSocketComponent;
          }
          if (data.payload instanceof UserSocket) {
            return UserSocketComponent;
          }
          return Presets.classic.Socket;
        },
        node(data) {
          if (data.payload instanceof DebugChat) {
            return ChatNodeComponent;
          }
          return CustomNodeComponent;
        },
      },
    }),
  );

  arrange.addPreset(ArrangePresets.classic.setup());

  connection.addPreset(
    () =>
      new ClassicFlow({
        canMakeConnection(from, to) {
          const [source, target] = getSourceTarget(from, to) || [null, null];

          if (!source || !target || from === to) return false;

          const sockets = getConnectionSockets(
            editor,
            new Connection(
              editor.getNode(source.nodeId),
              source.key as never,
              editor.getNode(target.nodeId),
              target.key as never,
            ),
          );

          if (!sockets.source.isCompatibleWith(sockets.target)) {
            log("Sockets are not compatible", "error");
            connection.drop();
            return false;
          }

          return Boolean(source && target);
        },
        makeConnection(from, to, context) {
          const [source, target] = getSourceTarget(from, to) || [null, null];
          const { editor } = context;

          Export();

          if (source && target) {
            editor.addConnection(
              new Connection(
                editor.getNode(source.nodeId),
                source.key as never,
                editor.getNode(target.nodeId),
                target.key as never,
              ),
            );
            return true;
          }
        },
      }),
  );

  editor.use(engine);
  editor.use(dataflow);
  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);
  AreaExtensions.showInputControl(area);

  editor.addPipe((context) => {
    if (context.type === "connectioncreate") {
      const { data } = context;
      const { source, target } = getConnectionSockets(editor, data);

      if (!source.isCompatibleWith(target)) {
        log("Sockets are not compatible", "error");
        return;
      }
    }
    return context;
  });

  addCustomBackground(area);

  const chat = new DebugChat((message) => {
    area.update("node", chat.id);
    if (message.own) {
      const onMessage = editor
        .getNodes()
        .filter((n): n is OnMessage => n instanceof OnMessage);
      dataflow.reset();

      for (const node of onMessage) {
        node.inputMessage = message.message;
        engine.execute(node.id);
      }
    }
  });

  const onMessage = new OnMessage();
  const match = new MatchMessage(".*hello.*", dataflow);
  const message1 = new Message("Hello!");
  const message2 = new Message("ッ");
  const send1 = new SendMessage(dataflow, respond);
  const send2 = new SendMessage(dataflow, respond);

  await editor.addNode(onMessage);
  await editor.addNode(match);
  await editor.addNode(message1);
  await editor.addNode(message2);
  await editor.addNode(send1);
  await editor.addNode(send2);
  await editor.addNode(chat);

  const con1 = new Connection(onMessage, "exec", match, "exec");
  const con2 = new Connection(onMessage, "text", match, "text");
  const con3 = new Connection(message1, "text", send1, "text");
  const con4 = new Connection(message2, "text", send2, "text");
  const con5 = new Connection(match, "consequent", send1, "exec");
  const con6 = new Connection(match, "alternate", send2, "exec");

  await editor.addConnection(con1);
  await editor.addConnection(con2);
  await editor.addConnection(con3);
  await editor.addConnection(con4);
  await editor.addConnection(con5);
  await editor.addConnection(con6);

  const Export = () => {
    const dataNodes = {
      nodes: [] as {
        id: string;
        label: string;
        controls: any;
        inputs: any;
        outputs: any;
        height: number | string;
        width: number;
      }[],
    };

    const dataConnections = {
      connections: [] as {
        id: string;
        source: string;
        sourceOutput: string;
        target: string;
        targetInput: string;
      }[],
    };

    const nodes = editor.getNodes();
    const connections = editor.getConnections();

    for (const node of nodes) {
      dataNodes.nodes.push({
        id: node.id,
        label: node.label,
        controls: node.controls,
        inputs: node.inputs,
        outputs: node.outputs,
        height: node.height,
        width: node.width,
      });
    }

    for (const connection of connections) {
      dataConnections.connections.push({
        id: connection.id,
        source: connection.source,
        sourceOutput: connection.sourceOutput,
        target: connection.target,
        targetInput: connection.targetInput,
      });
    }

    if (dataNodes.nodes.length > 0) {
      localStorage.setItem("nodes", JSON.stringify(dataNodes));
    }

    if (dataConnections.connections.length > 0) {
      localStorage.setItem("connections", JSON.stringify(dataConnections));
    }
  };

  // const Import = async () => {
  //   const dataNodes = JSON.parse(localStorage.getItem("nodes") || "");
  //   // const dataConnections = JSON.parse(
  //   //   localStorage.getItem("connections") || "",
  //   // );

  //   if (dataNodes) {
  //     for (const node of dataNodes.nodes) {
  //       if (node.label == "On message") {
  //         const onMessage = new OnMessage();
  //         await editor.addNode(onMessage);
  //       }

  //       if (node.label == "Match message") {
  //         const match = new MatchMessage(node.controls.regexp.value, dataflow);
  //         await editor.addNode(match);
  //       }

  //       if (node.label == "Message") {
  //         const message = new Message(node.controls.value.value);
  //         await editor.addNode(message);
  //       }

  //       if (node.label == "Send message") {
  //         const send = new SendMessage(dataflow, respond);
  //         await editor.addNode(send);
  //       }

  //       // for (const connection of dataConnections.connections) {
  //       //   const from = editor.getNode(connection.source);
  //       //   const sourceOutput = connection.sourceOutput;
  //       //   const to = editor.getNode(connection.target);
  //       //   const targetInput = connection.targetInput;

  //       //   if (from && to) {
  //       //     editor.addConnection(
  //       //       new Connection(
  //       //         from,
  //       //         sourceOutput as never,
  //       //         to,
  //       //         targetInput as never,
  //       //       ),
  //       //     );
  //       //   }
  //       // }
  //     }
  //   }
  // };

  if (editor) {
    Export();
    // Import();
  }

  await arrange.layout();
  await area.translate(chat.id, { x: 1000, y: 500 });

  return {
    destroy: () => area.destroy(),
  };
}

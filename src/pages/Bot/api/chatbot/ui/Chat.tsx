import * as React from "react";
import styled, { css } from "styled-components";
import { Drag } from "rete-react-plugin";
import { DebugChat } from "../nodes/debug-chat";
import { Avatar, Button, Card, Input, Layout, List, Space } from "antd";
import ReactMarkdown from "react-markdown";

type NodeExtraData = { width?: number; height?: number };

export const NodeStyles = styled.div<NodeExtraData & { selected: boolean }>`
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: ${(props) =>
    Number.isFinite(props.width) ? `${props.width}px` : `180px`};
  height: ${(props) =>
    Number.isFinite(props.height) ? `${props.height}px` : "auto"};
  position: relative;
  user-select: none;
  line-height: initial;
  font-family: Arial;
  position: relative;

  ${(props) =>
    props.selected &&
    css`
      border-color: #ff0000c4;
    `}
`;

const HandleArea = styled.div`
  position: absolute;
  left: 0;
  margin: auto;
  width: 100%;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grabbing;
`;

const Handle = styled(Button)`
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  z-index: 1;
  cursor: grab;

  :active {
    cursor: grabbing;
  }
`;

const ChatLayout = styled(Layout)`
  background: #6b6b6e;
  background-size: cover;
  border-radius: 0.5em;
  height: 100%;
  width: 100%;
  cursor: default;
`;

const MessagesLayout = styled(Layout)`
  background: transparent;
  padding: 2em 1em;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 1em;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(150, 150, 150, 0.3);
    border-radius: 1em;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ChatMessage = styled(List.Item)`
  width: 80%;
  min-width: 10em;
  border-block-end: unset !important;

  p {
    margin: 0;
  }
`;

const ChatButton = styled(Button)`
  padding: 0em 2em;
  height: 100%;
  border-color: #d9d9d9 !important;

  :hover {
    background-color: #d9d9d9 !important;
  }
`;

function Message(props: { avatar: string; message: string; own: boolean }) {
  return (
    <ChatMessage style={{ marginLeft: props.own ? "auto" : "" }}>
      <List.Item.Meta
        avatar={!props.own && <Avatar src={props.avatar} />}
        description={
          <Card
            style={
              props.own
                ? {
                    background: "#ffffff66",
                    borderColor: "#ffffff66",
                    color: "white",
                  }
                : {}
            }
            bodyStyle={{
              padding: "6px",
              fontSize: "1.3em",
            }}
          >
            <ReactMarkdown>{props.message}</ReactMarkdown>
          </Card>
        }
      />
    </ChatMessage>
  );
}

const TextBox = styled(Space.Compact)`
  width: 100%;
  padding: 2em 1em;
`;

type Props = {
  data: DebugChat & NodeExtraData;
};

export type NodeComponent = (props: Props) => JSX.Element;

export function ChatNodeComponent(props: Props) {
  const selected = props.data.selected || false;
  const { width, height } = props.data;
  const [text, setText] = React.useState("");
  const messagesLayout = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesLayout.current) {
      messagesLayout.current.scrollTo(0, messagesLayout.current.scrollHeight);
    }
  }, [props.data.messages.length]);

  return (
    <NodeStyles selected={selected} width={width} height={height}>
      <HandleArea>
        <Handle type="dashed">...</Handle>
      </HandleArea>
      <Drag.NoDrag>
        <ChatLayout onPointerDown={(e) => e.stopPropagation()}>
          <MessagesLayout
            ref={messagesLayout}
            onWheel={(e) => {
              if (!messagesLayout.current) return;

              const el = messagesLayout.current;

              if (
                e.deltaY > 0 &&
                el.scrollTop + el.clientHeight + 1 < el.scrollHeight
              ) {
                e.stopPropagation();
              } else if (e.deltaY < 0 && el.scrollTop > 0) {
                e.stopPropagation();
              }
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={props.data.messages}
              renderItem={(item) => <Message {...item} />}
            />
          </MessagesLayout>
          <TextBox>
            <Input
              size="large"
              value={text}
              style={{ fontSize: "1.5em", height: "2em" }}
              onInput={(e) => setText((e.target as HTMLInputElement).value)}
              placeholder="Your message..."
            />
            <ChatButton
              onClick={() => {
                props.data.userSend(text);
                setText("");
              }}
            ></ChatButton>
          </TextBox>
        </ChatLayout>
      </Drag.NoDrag>
      <HandleArea>
        <Handle type="dashed">...</Handle>
      </HandleArea>
    </NodeStyles>
  );
}

import { useCallback } from "react";
import { message } from "antd";
import { useRete } from "rete-react-plugin";
import { createEditor } from "../api/editor";
import Menu from "./Menu";
import "./style.css";

const BotPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const create = useCallback(
    (el: HTMLElement) => {
      return createEditor(el, (text, type) => messageApi[type](text));
    },
    [messageApi],
  );
  const [ref] = useRete(create);

  return (
    <>
      <div className="relative h-screen w-screen">
        {contextHolder}
        <div ref={ref} style={{ height: "100vh", width: "100vw" }}></div>
        <Menu />
      </div>
    </>
  );
};

export default BotPage;

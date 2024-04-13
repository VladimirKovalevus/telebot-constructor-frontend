import { Link } from "react-router-dom";
import axios from "axios";
import { Timer } from "../api/chatbot/nodes";

const Menu = () => {
  const saveData = () => {
    const nodes = localStorage.getItem("nodes");
    console.log(nodes);

    axios.post("/api/save", { nodes, token: "123" });
    console.log(axios.post("/api/save", { nodes, token: "123" }));
  };

  return (
    <div className="btm-nav btm-nav-xs absolute bottom-0">
      <Link to={"/bots"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </Link>
      <button
        id="cancelTimerButton"
        onClick={() => {
          Timer.cancelTimer();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <button onClick={() => saveData()}>update</button>
    </div>
  );
};

export default Menu;

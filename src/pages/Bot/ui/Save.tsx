import axios from "axios";

const Save = () => {
  const saveData = () => {
    const nodes = localStorage.getItem("nodes");
    console.log(nodes);

    axios.post("/api/save", { nodes, token: "123" });
    console.log(axios.post("/api/save", { nodes, token: "123" }));
  };

  return (
    <div className="absolute right-0 top-0 p-4">
      <button className="btn btn-primary" onClick={() => saveData()}>
        Save Bro
      </button>
    </div>
  );
};

export default Save;

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./providers/store";
import { RouterProvider } from "react-router-dom";
import router from "./providers/router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);

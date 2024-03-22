import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App.tsx";
import { AuthPage, BotPage, BotsPage, ErrorPage } from "@/pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="auth" element={<AuthPage />} />
      <Route path="bots" element={<BotsPage />} />
      <Route path="bot" element={<BotPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Route>,
  ),
);

export default router;

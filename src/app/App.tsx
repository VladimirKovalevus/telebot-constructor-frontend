import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/auth");
    }
  }, [location, navigate]);

  return <Outlet />;
};

export default App;

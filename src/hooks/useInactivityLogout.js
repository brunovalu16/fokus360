import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = (timeout = 120000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // não ativa se não estiver logado

    const logout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, timeout);
    };

    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, navigate]);
};

export default useInactivityLogout;

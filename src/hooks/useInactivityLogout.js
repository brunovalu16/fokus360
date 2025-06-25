import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityLogout = (timeout = 2 * 60 * 1000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = () => {
    // Remover o token/localStorage e redirecionar
    localStorage.removeItem('token');
    navigate('/login');
  };

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); // inicia o timer logo que o hook monta

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);
};

export default useInactivityLogout;

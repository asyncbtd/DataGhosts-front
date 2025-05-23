import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.scss';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navigation">
      <button 
        className={`navigation__button ${location.pathname === '/locations' ? 'navigation__button--active' : ''}`}
        onClick={() => navigate('/locations')}
      >
        Локации
      </button>
      <button 
        className={`navigation__button ${location.pathname === '/chat' ? 'navigation__button--active' : ''}`}
        onClick={() => navigate('/chat')}
      >
        Чат
      </button>
      <button 
        className={`navigation__button ${location.pathname === '/settings' ? 'navigation__button--active' : ''}`}
        onClick={() => navigate('/settings')}
      >
        Настройки
      </button>
    </nav>
  );
};

export default Navigation; 
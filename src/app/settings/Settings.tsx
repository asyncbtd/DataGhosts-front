import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Settings.scss';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = Cookies.get('jwt_token');
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accessToken: token })
      });

      if (response.ok) {
        Cookies.remove('jwt_token');
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Ошибка при выходе:', errorData);
        // Даже если запрос не удался, все равно удаляем токен и перенаправляем на логин
        Cookies.remove('jwt_token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // В случае ошибки также удаляем токен и перенаправляем на логин
      Cookies.remove('jwt_token');
      navigate('/login');
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-page__title">Настройки</h1>
      <div className="settings-page__content">
        <button 
          className="settings-page__logout-button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; 
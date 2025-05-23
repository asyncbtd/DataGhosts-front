import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.scss';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('jwt_token', data.accessToken, { 
          expires: 7,
          secure: false,
          sameSite: 'strict'
        });
        navigate('/chat');
      } else if (response.status === 400) {
        const errorData = await response.json();
        setError(`Ошибка: ${JSON.stringify(errorData)}`);
      } else if (response.status === 500) {
        const errorData = await response.json();
        setError(`Ошибка сервера: ${JSON.stringify(errorData)}`);
      } else {
        setError('Неизвестная ошибка');
      }
    } catch (error) {
      setError('Ошибка при отправке запроса');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-page__form">
        <h2 className="login-page__title">Авторизация</h2>
        
        {error && (
          <div className="login-page__error">
            {error}
          </div>
        )}

        <div className="login-page__field">
          <label htmlFor="username" className="login-page__label">Имя пользователя</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="login-page__input"
          />
        </div>

        <div className="login-page__field">
          <label htmlFor="password" className="login-page__label">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="login-page__input"
          />
        </div>

        <button type="submit" className="login-page__button">
          Войти
        </button>

        <div className="login-page__register-link">
          Нет аккаунта? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Зарегистрироваться</a>
        </div>
      </form>
    </div>
  );
}

export default LoginPage; 
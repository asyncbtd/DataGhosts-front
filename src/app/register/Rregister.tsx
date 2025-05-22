import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.scss';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        navigate('/login');
      } else if (response.status === 400 || response.status === 500) {
        const errorData = await response.json();
        setError(errorData.message || 'Произошла ошибка при регистрации');
      } else {
        setError('Неизвестная ошибка');
      }
    } catch (error) {
      setError('Ошибка при отправке запроса');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-page__form">
        <h2 className="register-page__title">Регистрация</h2>
        
        {error && (
          <div className="register-page__error">
            {error}
          </div>
        )}

        <div className="register-page__field">
          <label htmlFor="username" className="register-page__label">Имя пользователя</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="register-page__input"
          />
        </div>

        <div className="register-page__field">
          <label htmlFor="email" className="register-page__label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="register-page__input"
          />
        </div>

        <div className="register-page__field">
          <label htmlFor="password" className="register-page__label">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="register-page__input"
          />
        </div>

        <div className="register-page__field">
          <label htmlFor="confirmPassword" className="register-page__label">Подтвердите пароль</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="register-page__input"
          />
        </div>

        <button type="submit" className="register-page__button">
          Зарегистрироваться
        </button>

        <div className="register-page__login-link">
          Уже есть аккаунт? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Войти</a>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage; 
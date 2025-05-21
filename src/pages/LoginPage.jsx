import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/locations');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="username"
          placeholder="Имя пользователя"
          value={form.username}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
        <a className={styles.link} href="/register">
          Зарегистрироваться
        </a>
        {error && <div className="status-message error" style={{marginTop:8, width: '100%'}}>{error}</div>}
      </form>
    </div>
  );
} 
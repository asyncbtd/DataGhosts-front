import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form);
      setSuccess('Регистрация успешна!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
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
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
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
          Зарегистрироваться
        </button>
        <a className={styles.link} href="/login">
          Уже есть аккаунт? Войти
        </a>
        {error && <div className="status-message error" style={{marginTop:8, width: '100%'}}>{error}</div>}
        {success && <div className="status-message success" style={{marginTop:8, width: '100%'}}>{success}</div>}
      </form>
    </div>
  );
} 
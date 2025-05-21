import React, { useEffect, useState } from 'react';
import { getLocationById } from '../api';
import { useParams } from 'react-router-dom';

export default function LocationDetailPage() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getLocationById(id).then(setLocation).catch(err => setError(err.message || 'Ошибка загрузки'));
  }, [id]);

  if (error) return <div className="main-content"><div className="status-message error">{error}</div></div>;
  if (!location) return <div className="main-content"><div className="card">Загрузка...</div></div>;

  return (
    <div className="main-content">
      <div className="card">
        <h2>{location.name}</h2>
        <p>{location.comment}</p>
        <h3>Враги:</h3>
        <ul className="enemies-list">
          {location.enemies && location.enemies.length > 0 ? location.enemies.map(e => (
            <li key={e.id}>
              <b>{e.name}</b> (уровень: {e.level}, здоровье: {e.health}, урон: {e.damage})<br/>
              {e.comment}
            </li>
          )) : <li>Нет врагов</li>}
        </ul>
      </div>
    </div>
  );
} 
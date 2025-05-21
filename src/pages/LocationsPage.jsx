import React, { useEffect, useState } from 'react';
import { getLocations } from '../api';
import { useNavigate } from 'react-router-dom';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getLocations().then(setLocations).catch(err => setError(err.message || 'Ошибка загрузки'));
  }, []);

  return (
    <div className="main-content">
      <div className="card">
        <h2>Локации</h2>
        {error && <div className="status-message error">{error}</div>}
        <ul className="locations-list">
          {locations.map(loc => (
            <li key={loc.id}>
              <a href="#" onClick={e => {e.preventDefault();navigate(`/locations/${loc.id}`);}}>
                {loc.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

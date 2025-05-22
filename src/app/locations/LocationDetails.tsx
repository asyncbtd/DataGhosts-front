import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../core/api/api';
import type { LocationWithEnemiesDto, Enemy } from '../core/api/api';
import './Locations.scss';

function LocationDetails() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationWithEnemiesDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      try {
        const data = await api.locations.getById(id);
        setLocation(data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке информации о локации');
        console.error('Error fetching location:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (loading) {
    return <div className="location-details__loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="location-details__error">{error}</div>;
  }

  if (!location) {
    return <div className="location-details__not-found">Локация не найдена</div>;
  }

  return (
    <div className="location-details">
      <h2 className="location-details__title">{location.name}</h2>
      <div className="location-details__content">
        <p className="location-details__comment">{location.comment}</p>
        {location.enemies && location.enemies.length > 0 && (
          <div className="location-details__enemies">
            <h3>Враги в этой локации:</h3>
            <ul>
              {location.enemies.map((enemy: Enemy) => (
                <li key={enemy.id}>
                  {enemy.name} (Здоровье: {enemy.health}, Урон: {enemy.damage}, Уровень: {enemy.level})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationDetails; 
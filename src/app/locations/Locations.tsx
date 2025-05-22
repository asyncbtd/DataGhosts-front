import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../core/api/api';
import type { Location } from '../core/api/api';
import './Locations.scss';

function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.locations.getAll();
        setLocations(data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке локаций');
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (id: number) => {
    navigate(`/locations/${id}`);
  };

  if (loading) {
    return <div className="locations-page__loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="locations-page__error">{error}</div>;
  }

  return (
    <div className="locations-page">
      <h2 className="locations-page__title">Список локаций</h2>
      {locations.length === 0 ? (
        <p>Локации не найдены</p>
      ) : (
        <div className="locations-page__grid">
          {locations.map((location) => (
            <div
              key={location.id}
              className="locations-page__card"
              onClick={() => handleLocationClick(location.id)}
              role="button"
              tabIndex={0}
            >
              <h3 className="locations-page__card-title">{location.name}</h3>
              <p className="locations-page__card-comment">{location.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationsPage; 
import Cookies from 'js-cookie';

const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  });

  // Добавляем токен в заголовки, если требуется авторизация
  if (requiresAuth) {
    const token = Cookies.get('jwt_token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Если токен истек или недействителен, удаляем его и перенаправляем на страницу входа
      Cookies.remove('jwt_token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Проверяем, есть ли тело ответа
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as Promise<T>;
}

// Методы для работы с API
export const api = {
  // Аутентификация
  auth: {
    login: (username: string, password: string) => 
      apiRequest<string>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        requiresAuth: false,
      }),
    
    register: (username: string, email: string, password: string) =>
      apiRequest<string>('/registration', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        requiresAuth: false,
      }),
  },

  // Локации
  locations: {
    getAll: () => 
      apiRequest<Location[]>('/locations'),
    
    getById: (id: string) => 
      apiRequest<LocationWithEnemiesDto>(`/locations/${id}`),
    
    create: (data: Omit<Location, 'id'>) => 
      apiRequest<Location>('/locations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: Partial<Location>) => 
      apiRequest<Location>(`/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) => 
      apiRequest<void>(`/locations/${id}`, {
        method: 'DELETE',
      }),
  },
};

// Типы данных
export interface Location {
  id: number;
  name: string;
  comment: string;
}

export interface Enemy {
  id: number;
  name: string;
  health: number;
  damage: number;
  level: number;
  comment: string;
}

export interface LocationWithEnemiesDto extends Location {
  enemies: Enemy[];
} 
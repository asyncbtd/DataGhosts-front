// API base URL
const API_URL = '/api';

export async function register({ username, email, password }) {
  const res = await fetch(`${API_URL}/registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw await res.json();
  return await res.text();
}

export async function login({ username, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw await res.json();
  const data = await res.json();
  localStorage.setItem('token', data.accessToken);
  return data;
}

export async function logout() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ accessToken: token })
  });
  localStorage.removeItem('token');
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function getLocations() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/locations`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export async function getLocationById(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/locations/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw await res.json();
  return await res.json();
}

export class WebSocketController {
  constructor(url = '/ws-chat') {
    // Если url начинается с /, то используем текущий хост
    const wsUrl = url.startsWith('/')
      ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}${url}`
      : url;
    this.ws = new WebSocket(wsUrl);
    this.listeners = {};
    this.ws.onmessage = (event) => {
      if (this.listeners['message']) {
        this.listeners['message'](event.data);
      }
    };
    this.ws.onopen = () => {
      if (this.listeners['open']) this.listeners['open']();
    };
    this.ws.onclose = () => {
      if (this.listeners['close']) this.listeners['close']();
    };
    this.ws.onerror = (e) => {
      if (this.listeners['error']) this.listeners['error'](e);
    };
  }

  send(data) {
    this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
  }

  on(event, callback) {
    this.listeners[event] = callback;
  }

  close() {
    this.ws.close();
  }
} 
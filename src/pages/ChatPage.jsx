import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { CompatClient, Stomp } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws-chat';
const TOPIC = '/topic/public';
const SEND_ENDPOINT = '/app/chat.send';

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const stompClient = useRef(null);

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe(TOPIC, (msg) => {
        const body = JSON.parse(msg.body);
        setMessages((prev) => [...prev, body]);
      });
    });
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && stompClient.current && stompClient.current.connected) {
      const message = {
        from: localStorage.getItem('username') || 'Anonymous',
        text: input,
      };
      stompClient.current.send(SEND_ENDPOINT, {}, JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div style={{ width: 500, minWidth: 220, maxWidth: 600, height: '100vh', borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column', background: '#fafbfc' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}><b>{msg.from}:</b> {msg.text} <span style={{color:'#888', fontSize:12}}>{msg.time ? new Date(msg.time).toLocaleTimeString() : ''}</span></div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: 10, borderTop: '1px solid #eee', background: '#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 6 }}
          placeholder="Введите сообщение..."
        />
        <button type="submit" style={{ borderRadius: 4, padding: '6px 12px' }}>→</button>
      </form>
    </div>
  );
} 
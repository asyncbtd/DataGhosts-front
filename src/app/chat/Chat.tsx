import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import './Chat.scss';

interface ChatMessageDto {
  from: string;
  text: string;
  time: Date;
}

interface ChatMessage {
  text: string;
  token: string;
}

const WS_BASE_URL = `ws://${window.location.host}/ws-chat`;
console.log('WebSocket URL:', WS_BASE_URL);

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_BASE_URL,
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        console.log('Creating WebSocket connection to:', WS_BASE_URL);
        return new WebSocket(WS_BASE_URL);
      },
      onConnect: () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        client.subscribe('/topic/public', (message: IMessage) => {
          const receivedMessage: ChatMessageDto = JSON.parse(message.body);
          setMessages(prev => [...prev, receivedMessage]);
        });

        client.subscribe('/topic/history', (message: IMessage) => {
          try {
            const history: ChatMessageDto[] = JSON.parse(message.body);
            setMessages(history);
          } finally {
            setIsLoadingHistory(false);
          }
        });

        client.publish({
          destination: '/app/chat.history',
          body: JSON.stringify({})
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers.message);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate().catch(console.error);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (stompClient && inputMessage.trim() && isConnected) {
      const token = Cookies.get('jwt_token');
      const chatMessage: ChatMessage = {
        text: inputMessage.trim(),
        token: token || ''
      };
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(chatMessage)
      });
      setInputMessage('');
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-page__status">
        {isConnected ? 'Подключено' : 'Отключено'}
      </div>
      <div className="chat-page__messages">
        {isLoadingHistory ? (
          <div className="chat-page__loading">Загрузка истории сообщений...</div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="chat-page__message">
              <div className="chat-page__message-header">
                <span className="chat-page__message-from">{message.from}</span>
                <span className="chat-page__message-time">{formatDate(message.time)}</span>
              </div>
              <div className="chat-page__message-text">{message.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-page__input">
        <input
          type="text"
          id="chat-message-input"
          name="chat-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Введите сообщение..."
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>Отправить</button>
      </div>
    </div>
  );
}

export default ChatPage; 
import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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

const WS_BASE_URL = '/ws-chat';

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
      webSocketFactory: () => {
        const socket = new SockJS(WS_BASE_URL);
        console.log('SockJS created with URL:', WS_BASE_URL);
        return socket;
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);

        // Подписываемся на публичные сообщения
        client.subscribe('/topic/public', (message: IMessage) => {
          console.log('Received public message:', message.body);
          const receivedMessage: ChatMessageDto = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        // Подписываемся на историю чата
        client.subscribe('/topic/history', (message: IMessage) => {
          console.log('Received chat history message:', message);
          console.log('Message headers:', message.headers);
          console.log('Message body:', message.body);
          try {
            const history: ChatMessageDto[] = JSON.parse(message.body);
            console.log('Parsed history:', history);
            if (Array.isArray(history)) {
              setMessages(history);
            } else {
              console.error('History is not an array:', history);
            }
          } catch (error) {
            console.error('Error parsing chat history:', error);
          } finally {
            setIsLoadingHistory(false);
          }
        });

        // Запрашиваем историю чата
        console.log('Requesting chat history...');
        client.publish({
          destination: '/app/chat.history',
          body: JSON.stringify({})
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setIsConnected(false);
        setIsLoadingHistory(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
        setIsLoadingHistory(false);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        setIsLoadingHistory(false);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
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
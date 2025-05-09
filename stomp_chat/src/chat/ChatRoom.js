import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결 (선택)
      onConnect: () => {
        console.log('✅ STOMP Connected!');
        setConnected(true);

        stompClient.subscribe('/topic/chat', (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body.content]);
        });
      },
      onDisconnect: () => {
        console.log('❌ STOMP Disconnected');
        setConnected(false);
      },
      debug: (str) => console.log('[DEBUG]', str),
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (stompClient && stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, []); // ⭐ 반드시 빈 배열로 초기 1회만 실행

  const sendMessage = () => {
    const client = clientRef.current;
    if (client && client.connected && input.trim() !== '') {
      client.publish({
        destination: '/app/chat',
        body: JSON.stringify({ content: input }),
      });
      setInput('');
    } else {
      console.warn('STOMP 연결 전이거나 입력이 비어 있음');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 채팅방</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="메시지를 입력하세요"
        style={{ width: '300px', marginRight: 10 }}
      />
      <button onClick={sendMessage} disabled={!connected}>
        전송
      </button>
    </div>
  );
};

export default ChatRoom;
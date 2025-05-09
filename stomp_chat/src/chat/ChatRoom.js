// src/pages/ChatRoomPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[STOMP DEBUG]', str),
      onConnect: () => {
        console.log('✅ STOMP 연결 성공');

        // 기존 구독이 있으면 해제
        subscriptionRef.current?.unsubscribe?.();

        // 새로 구독
        const subscription = stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data.content]);
        });

        subscriptionRef.current = subscription;
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      console.log('🧹 연결 해제');
      subscriptionRef.current?.unsubscribe?.();
      stompClientRef.current?.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (client && client.connected && input.trim() !== '') {
      client.publish({
        destination: '/app/chat',
        body: JSON.stringify({ content: input, roomId }),
      });
      setInput('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🟢 채팅방 {roomId}</h2>
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
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
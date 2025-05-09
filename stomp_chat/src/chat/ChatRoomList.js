// src/pages/ChatListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/chat')
      .then((res) => res.json())
      .then((data) => setChatRooms(data))
      .catch((err) => console.error('채팅방 목록 불러오기 실패', err));
  }, []);

  const enterChatRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 채팅방 목록</h2>
      <ul>
        {chatRooms.map((room, index) => (
            <li key={index}>
            <div style={{ marginBottom: '10px' }}>
                <div><strong>Room ID:</strong> {room.roomId}</div>
                <button onClick={() => enterChatRoom(room.roomId)}>
                    이 채팅방 입장
                </button>
            </div>
            </li>
        ))}
    </ul>
    </div>
  );
};

export default ChatRoomList;
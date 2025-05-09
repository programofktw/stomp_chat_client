import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoomList from './chat/ChatRoomList';
import ChatRoom from './chat/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatRoomList />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
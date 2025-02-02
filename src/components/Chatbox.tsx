import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Chatbox = ({user, selectedUserChat}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);
    if (user?.name) {
      newSocket.emit('join', user.name);
    }
    return () => {
      newSocket.close();
    }; 
  }, [user?.name]);

  useEffect(() => {
    setMessages([]);
  }, [selectedUserChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', ({ sender, recipient, message }) => {
      if (sender === selectedUserChat || sender === user?.name) {
        setMessages(prevMessages => [...prevMessages, { sender, message }]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket, selectedUserChat, user?.name]);

  const sendMessage = () => {
    if (message.trim() && user?.name && selectedUserChat && socket) {
      const messageData = {
        sender: user.name,
        recipient: selectedUserChat,
        message: message.trim()
      };
      
      // Send to server
      socket.emit('private_message', messageData);
      
      // Clear input
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md h-[500px] border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-t-lg">
        {selectedUserChat ? `Chat with ${selectedUserChat}` : 'Select a user to start chatting'}
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.sender === user?.name
                ? 'bg-blue-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            <p className="font-bold">{msg.sender}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      {selectedUserChat && (
        <div className="flex items-center px-4 py-2 border-t border-gray-300">
          <textarea
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbox;

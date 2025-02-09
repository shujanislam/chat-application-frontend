import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Notification from "./Notification";

const Chatbox = ({ user, selectedUserChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize socket
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    if (user?.name) {
      newSocket.emit("join", user.name);
    }

    return () => {
      newSocket.close();
    };
  }, [user?.name]);

  // Listen for typing events
  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ sender }) => {
      if (sender === selectedUserChat) {
        setIsTyping(true);
      }
    });

    socket.on("stop_typing", ({ sender }) => {
      if (sender === selectedUserChat) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, selectedUserChat]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", ({ sender, recipient, message }) => {
      if (sender === selectedUserChat || sender === user?.name) {
        setMessages((prevMessages) => [...prevMessages, { sender, message }]);
      }

      // Show notification only if the sender is not the current user
      if (sender !== user?.name) {
        setNotification({ sender, message });
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUserChat, user?.name]);

  // Clear messages when changing users
  useEffect(() => {
    setMessages([]);
  }, [selectedUserChat]);

  const sendMessage = () => {
    if (message.trim() && user?.name && selectedUserChat && socket) {
      const messageData = {
        sender: user.name,
        recipient: selectedUserChat,
        message: message.trim(),
      };

      // Send to server
      socket.emit("private_message", messageData);

      // Clear input
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="px-4 py-2 bg-white text-black font-semibold rounded-t-lg border-b border-gray-200">
        {selectedUserChat ? `Chat with ${selectedUserChat}` : "Select a user to start chatting"}
      </div> 
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender === user?.name ? "bg-blue-100 text-right self-end" : "bg-gray-100 text-left self-start"
            }`}
          >
            <p className="font-semibold text-sm">{msg.sender}</p>
            <p className="text-sm">{msg.message}</p>
          </div>
        ))}
      </div> 
  
      {/* Typing Indicator */}
      {isTyping && <p className="text-gray-500 text-sm italic">{selectedUserChat} is typing...</p>}
      {/* Message Input Section */}
      {selectedUserChat && (
        <div className="flex items-center px-4 py-2 border-t border-gray-300 bg-white">
          <textarea
  className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
  rows={1}
  placeholder="Type your message..."
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);

    // Emit "typing" event
    if (socket && selectedUserChat) {
      socket.emit("typing", { sender: user.name, recipient: selectedUserChat });
    }

    // Clear previous timeout & stop typing after 2s of inactivity
    if (socket && selectedUserChat) {
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit("stop_typing", { sender: user.name, recipient: selectedUserChat });
      }, 2000);
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();

      // Emit "stop_typing" when message is sent
      if (socket && selectedUserChat) {
        socket.emit("stop_typing", { sender: user.name, recipient: selectedUserChat });
      }
    }
  }}
/>

          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      )}

      {/* Notification Component */}
      {notification && (
        <Notification sender={notification.sender} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default Chatbox;

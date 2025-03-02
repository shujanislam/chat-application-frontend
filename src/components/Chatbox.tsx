import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import CustomNotification from "./Notification";
import MessageList from "./MessageList";
import ReplyPreview from "./ReplyPreview";

const Chatbox = ({ user, selectedUserChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

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

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", ({ sender, recipient, message, replyTo }) => {
      if (sender === selectedUserChat || recipient === selectedUserChat) {
        setMessages((prevMessages) => {
          if (sender === "Bot" && prevMessages.some((msg) => msg.sender === "Bot" && msg.message === message)) {
            return prevMessages;
          }
          return [...prevMessages, { sender, message, replyTo }];
        });
      }
      if (sender !== user?.name && sender !== "Bot") {
        setNotification({ sender, message });
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUserChat, user?.name]);

  useEffect(() => {
    setMessages([]);
    setReplyingTo(null);
  }, [selectedUserChat]);

  const handleReply = (msgToReply) => {
    setReplyingTo(msgToReply);
  };

  const sendMessage = async (msg) => {
    if (msg.trim() && user?.name && selectedUserChat && socket) {
      const messageData = {
        sender: user.name,
        recipient: selectedUserChat,
        message: msg.trim(),
        replyTo: replyingTo
      };

      socket.emit("private_message", messageData);
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          sender: user.name, 
          message: msg.trim(),
          replyTo: replyingTo
        }
      ]);

      // Reset replyingTo after sending
      setReplyingTo(null);

      // Check if message is directed to bot
      if (selectedUserChat === "Bot") {
        socket.emit("bot_message", messageData);
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFileURL(url);
    }
  };

  const handleUpload = () => {
    if (file && fileURL) {
      sendMessage(`📂 [${file.name}](${fileURL})`);
      setFile(null);
      setFileURL(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-4 py-2 bg-white text-black font-semibold rounded-t-lg border-b border-gray-200">
        {selectedUserChat ? `Chat with ${selectedUserChat}` : "Select a user to start chatting"}
      </div>

      <MessageList 
        messages={messages} 
        user={user} 
        onReply={handleReply}
      />

      {selectedUserChat && (
        <div className="flex flex-col px-4 py-2 border-t border-gray-300 bg-white">
          {replyingTo && (
            <ReplyPreview 
              replyTo={replyingTo} 
              onCancel={() => setReplyingTo(null)} 
            />
          )}
          
          <div className="flex items-center">
            <label className="cursor-pointer p-2 text-gray-600 hover:text-gray-900">
              📎
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>

            <textarea
              className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              rows={1}
              placeholder={`Message @${selectedUserChat}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(message);
                  setMessage("");
                }
              }}
            />

            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                sendMessage(message);
                setMessage("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {file && <FileUpload file={file} onUpload={handleUpload} onClose={() => setFile(null)} />}

      {notification && <CustomNotification sender={notification.sender} message={notification.message} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default Chatbox;

import { useState } from "react";
import MessageMenu from "./TextOptions";

const MessageList = ({ messages, user, onReply }) => {
  // State for menu visibility & position
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const handleMenuOpen = (event, msg) => {
    const rect = event.target.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedMessage(msg); // Store the entire message object
    setMenuOpen(true);
  };
  
  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`relative group p-3 rounded-lg max-w-xs ${
              msg.sender === user?.name ? "bg-blue-100 text-right self-end" : "bg-gray-100 text-left self-start"
            }`}
          >
            <p className="font-semibold text-sm">{msg.sender}</p>
            
            {/* Display reply preview if this message is a reply */}
            {msg.replyTo && (
              <div className="mb-2 mt-2 p-2 bg-white rounded text-xs text-left border-l-2 border-gray-400">
                <span className="font-semibold">{msg.replyTo.sender}</span>: {msg.replyTo.message}
              </div>
            )}
            
            {msg.message.includes("[") && msg.message.includes("](") ? (
              <a
                href={msg.message.match(/\((.*?)\)/)[1]} // Extract URL from message
                target="_blank"
                rel="noopener noreferrer"
                className="text-black no-underline"
              >
                📂 {msg.message.match(/\[(.*?)\]/)[1]} {/* Extract file name */}
              </a>
            ) : (
              <p className="text-sm">{msg.message}</p>
            )}
            
            {/* Three Dots Button */}
            <div
              className="absolute top-2 left-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={(e) => handleMenuOpen(e, msg)}
            >
              <span className="text-gray-600 text-lg">⋮</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pop-up Menu Component */}
      <MessageMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        position={menuPosition} 
        message={selectedMessage} 
        onReply={onReply}
      />
    </>
  );
};

export default MessageList;

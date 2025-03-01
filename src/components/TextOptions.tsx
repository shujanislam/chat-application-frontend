import { useEffect, useRef } from "react";

const MessageMenu = ({ isOpen, onClose, position, message }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const summarizeAI = async() => {
    try{
      const response = await fetch(`http://localhost:8000/summarize-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if(response.ok){
        let data = await response.json();
      }
      else{
        console.log('not working')
      }
    }
    catch(err){
      console.log(err.message);
    }
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-10 bg-white border shadow-lg rounded-md py-2 w-36 text-sm"
      style={{ top: position.top, left: position.left }}
    >
      <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left" onClick={() => alert("Reply clicked")}>
        Reply
      </button>
      <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left" onClick={() => alert("Edit clicked")}>
        Edit
      </button>
      <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left" onClick={summarizeAI}>
        AI summarize
      </button>
      <button className="block w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500" onClick={() => alert("Delete clicked")}>
        Delete
      </button>
    </div>
  );
};

export default MessageMenu;

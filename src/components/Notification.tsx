import { useEffect } from 'react';

const CustomNotification = ({ sender, message, onClose }) => {
  useEffect(() => {
    // Auto-hide notification after 2 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
      <p className="text-sm">
        <strong>{sender}</strong>: {message}
      </p>
    </div>
  );
};

export default CustomNotification;

const ReplyPreview = ({ replyTo, onCancel }) => {
  if (!replyTo) return null;
  
  return (
    <div className="flex items-center p-2 mb-2 bg-gray-200 rounded-lg relative">
      <div className="flex-1">
        <p className="text-xs text-gray-500">Replying to {replyTo.sender}:</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{replyTo.message}</p>
      </div>
      <button
        className="ml-2 text-gray-600 hover:text-red-500"
        onClick={onCancel}
      >
       x 
      </button>
    </div>
  );
};

export default ReplyPreview;

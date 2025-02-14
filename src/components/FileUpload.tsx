import { useState } from "react";

const FileUpload = ({ file, onUpload, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Upload File</h2>
        <p className="text-gray-600 mb-4">{file?.name}</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={onUpload}
        >
          Upload
        </button>
        <button
          className="ml-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

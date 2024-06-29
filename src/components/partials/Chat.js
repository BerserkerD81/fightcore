const Chat = ({ id, avatar, username, message, onDismiss, onChatClick }) => {
  const handleDismiss = () => {
    if (typeof onDismiss === 'function') {
      onDismiss(id);
    }
  };

  const handleClick = () => {
    if (typeof onChatClick === 'function') {
      onChatClick({ id, avatar, username, message });
    }
  };

  return (
    <div className="border-gradient-inverse p-4 mb-4 relative">
      <div className="flex items-center mb-4" onClick={handleClick}>
        <img
          src={avatar}
          alt="Avatar"
          className="w-15 h-15 rounded-full mr-4"
          style={{ objectFit: 'cover' }}
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{username}</h3>
          <p className="mt-1 max-w-xs break-words">{message}</p>
        </div>
      </div>
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={handleDismiss}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};


export default Chat;

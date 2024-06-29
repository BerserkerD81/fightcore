import React from 'react';

const challengeImage = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/street-fighter-x-tekken/8/8f/Punch.png?width=325";

const Post = ({ avatar, username, postImage, message }) => {
  const handleChallengeClick = () => {
    console.log(`Desafiando a Usuario: ${username}`);
  };

  return (
    <div className="border-gradient p-4 mb-4 relative">
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt="Avatar"
          className="w-15 h-15 rounded-full mr-4"
        />
        <h3 className="text-lg font-semibold">{username}</h3>
      </div>
      <div className="mb-4">
        <p>{message}</p>
      </div>
      {postImage && (
        <div className="relative">
          <img
            src={postImage}
            alt="Post"
            className="w-full rounded-lg mb-2"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="absolute bottom-5 right-5">
            <div className="border-gradient-fight flex justify-center items-center">
              <img
                src={challengeImage}
                alt="Challenge"
                className="cursor-pointer"
                onClick={handleChallengeClick}
                style={{ width: '60px', height: '60px', zIndex: '10', marginLeft: '-2px', marginTop: '-2px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

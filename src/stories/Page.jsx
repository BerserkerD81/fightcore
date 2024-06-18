// Page.jsx
import React, { useState } from 'react';
import './page.css';
import { doSignInWithGoogle } from '../auth';

export const Page = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        setIsSigningIn(false); // Reset state on successful sign-in
      } catch (error) {
        setIsSigningIn(false); // Reset state on error
        console.error('Error signing in with Google:', error);
      }
    }
  };

  return (
    <article className="article">
      <div className="circleMagenta"></div>
      <div className="box">
        <img src="https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png" className='box-img' alt="" />
      </div>
      <div className="circleTurquesa"></div>
      <button className="google-btn" onClick={onGoogleSignIn}>
        <span className="google-icon">
          <i className="fab fa-google"></i>
        </span>
        Sign Up with Google
      </button>
    </article>
  );
};

import React from 'react';
import './page.css';

export const Page = () => {
  return (
    <article className="article">
      <div className="circleMagenta"></div>
      <div className="box">
        <img src="https://i.ibb.co/BGF5CPS/OIG3-removebg-preview.png" className='box-img' alt="" />
      </div>

      <div className="circleTurquesa"></div>
      <button className="google-btn">
        <span className="google-icon">
          <i className="fab fa-google"></i>
        </span>
        Sign Up with Google
      </button>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"
        integrity="sha512-MFwb5eHNS5AX4RWhYkWxKHrRtHUcQ8MG0DtFFc35PRmf5UHmyROh22fL+TfYeTHROd6wN68vBzjlllgUKi1Z8Q=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
    </article>
  );
};

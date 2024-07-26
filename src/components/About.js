import React from 'react';
import './About.css'

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About PhotoNest</h1>
      <p className="about-description">
        Welcome to PhotoNest, your ultimate destination for organizing and
        storing your cherished photos. Whether you're a professional photographer,
        a hobbyist, or simply someone who loves to capture moments, PhotoNest
        provides a seamless and intuitive platform to keep your photos safe and
        easily accessible.
      </p>
      <p className="about-mission">
        Our mission is to offer a secure, elegant, and user-friendly gallery where
        you can store and manage your images with ease. At PhotoNest, we believe
        that every photo tells a story, and we're here to help you preserve those
        stories for years to come.
      </p>
      <p className="about-vision">
        With PhotoNest, you can:
      </p>
      <ul className="about-features">
        <li>Organize your photos into custom albums and collections.</li>
        <li>Access your photos from any device, anytime, anywhere.</li>
        <li>Enjoy an intuitive and user-friendly interface designed for effortless navigation.</li>
      </ul>
      
    </div>
  );
}

export default About;

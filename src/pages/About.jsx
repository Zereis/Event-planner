import React from 'react'
import '../styles/home.css';
import NavBubble from '../components/NavBubble';

export default function About() {


const bubbles = [
    {
      title: 'owen kraus',
      color: 'rgba(20, 20, 20, 0.2)',
      hoverColor: 'rgba(20, 20, 20, 0.5)',
      navRoute: 'https://github.com/owenboy9',
      position: { x: -250, y: 0 },
      scale: 1.5,
      textScale: 2.5,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.8,
    },
    {
      title: 'David Huang',
      color: 'rgba(221, 21, 21, 0.2)',
      hoverColor: 'rgba(221, 21, 21, 0.5)',
      navRoute: 'https://github.com/Zereis/',
      position: { x: -250, y: 250 },
      scale: 1.5,
      textScale: 2.5,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.0,
    },
    {
      title: 'Patrick Brandt',
      color: 'rgba(82, 124, 216, 0.2)',
      hoverColor: 'rgba(82, 124, 216, 0.5)',
      navRoute: 'https://github.com/Patrick-B-L',
      position: { x: 50, y: 0 },
      scale: 1.5,
      textScale: 2.5,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.7,
    },
    {
      title: 'Christina Fernestam',
      color: 'rgba(46, 226, 10, 0.2)',
      hoverColor: 'rgba(46, 226, 10, 0.5)',
      navRoute: 'https://github.com/Ferniie',
      position: { x: 50, y: 250 },
      scale: 1.5,
      textScale: 2.5,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.1,
    },
    {
      title: 'Karl-Johan Victor',
      color: 'rgba(243, 247, 8, 0.2)',
      hoverColor: 'rgba(243, 247, 8, 0.5)',
      navRoute: 'https://github.com/KalleVictor/',
      position: { x: -100, y: 500 },
      scale: 1.5,
      textScale: 2.5,
      clickable: true,
      origin: { x: -0, y: -210 },
      appearDuration: 0.9,
    },
  ];






  return (
    <div className="home-container"
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    >
        <div className="bubble-wrapper">
            <div className="bubble-container">
                {bubbles.map((bubble, index) => (
                    <NavBubble
                    key={index}
                    index={index}
                    title={bubble.title}
                    color={bubble.color}
                    hoverColor={bubble.hoverColor}
                    navRoute={bubble.navRoute}
                    onClick={bubble.onClick} // Pass onClick prop
                    position={bubble.position}
                    scale={bubble.scale}
                    textScale={bubble.textScale}
                    zIndex={index + 1}
                    clickable={bubble.clickable}
                    origin={bubble.origin}
                    appearDuration={bubble.appearDuration}
                    />
                ))}
            </div>
        </div>  
    </div>
  )
}

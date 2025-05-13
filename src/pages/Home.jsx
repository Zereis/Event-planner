import { useEffect, useState } from 'react';
import '../styles/home.css';
import NavBubble from '../components/NavBubble';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bubbles = [
    {
      title: 'Calendar',
      color: 'rgba(20, 20, 20, 0.2)',
      navRoute: '/calendar',
      position: { x: -180, y: 0 },
      scale: 1.8,
      textScale: 3,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.8,
    },
    {
      title: 'Add Task',
      color: 'rgba(221, 21, 21, 0.2)',
      navRoute: '/add',
      position: { x: -150, y: 180 },
      scale: 1.2,
      textScale: 3,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.0,
    },
    {
      title: 'Edit Task',
      color: 'rgba(82, 124, 216, 0.2)',
      navRoute: '/edit',
      position: { x: 0, y: 45 },
      scale: 1,
      textScale: 3,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 0.7,
    },
    {
      title: 'Today',
      color: 'rgba(46, 226, 10, 0.2)',
      navRoute: '/today',
      position: { x: 0, y: 180 },
      scale: 0.8,
      textScale: 5,
      clickable: true,
      origin: { x: 0, y: -200 },
      appearDuration: 1.1,
    },
    {
      title: 'Spin',
      color: 'rgba(243, 247, 8, 0.2)',
      navRoute: '/spin',
      position: { x: -20, y: 300 },
      scale: 0.5,
      textScale: 5,
      clickable: true,
      origin: { x: -0, y: -210 },
      appearDuration: 0.9,
    },
  ];

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''}`}> 
      <div className="bubble-wrapper" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div className="bubble-container">
        {bubbles.map((bubble, index) => (
          <NavBubble
            key={index}
            index={index}
            title={bubble.title}
            color={bubble.color}
            navRoute={bubble.navRoute}
            position={bubble.position}
            size={bubble.size}
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
  );
};

export default Home;

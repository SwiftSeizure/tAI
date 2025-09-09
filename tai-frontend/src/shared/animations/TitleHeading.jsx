import { useState, useEffect } from 'react'; 

export default function TitleHeading( {title, transitionTime, intro} ) { 

  const [visibleLetters, setVisibleLetters] = useState([]);
  const headingText = title;
  

  useEffect(() => { 
    setVisibleLetters([]);
    let index = -1; 
    let interval;

    const timeout = setTimeout(() => {  

        interval = setInterval(() => {
            if (typeof headingText === 'string' && index < headingText.length) {
                setVisibleLetters(prev => [...prev, index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, transitionTime); // Time between each letter falling 

    }, 50);
    
    return () => clearInterval(interval);
  }, [title]);
  
  return (

    <h1 className={`h1-title-title-card ${intro ? 'intro' : ''}`}>
        {headingText && headingText.split('').map((letter, index) => (
          <span 
            key={index}
            className={`${visibleLetters.includes(index) ? 'visible' : 'hidden'} ${letter === ' ' ? 'space' : ''}`}
            style={{ '--char-index': index }}
          >
            {letter}
          </span>
        ))}
      </h1>

  );
}
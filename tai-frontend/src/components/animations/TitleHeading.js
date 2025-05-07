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
            if (index < headingText.length) {
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

    <h1 className="text-[3.5rem] font-extrabold font-nunito relative overflow-hidden py-8">
        {headingText.split('').map((letter, index) => (
          <span 
            key={index}
            className={`inline-block transition-all duration-500  ${
              visibleLetters.includes(index) 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform -translate-y-16 opacity-0'
            }`}
            style={{ 
              transitionDelay: `${index * 0.05}s`,
              width: letter === ' ' ? '0.5em' : 'auto',  
              fontFamily: 'Nunito',  
              fontSize: intro ? '8rem' : '5rem',
            }}
          >
            {letter}
          </span>
        ))}
      </h1>

  );
}
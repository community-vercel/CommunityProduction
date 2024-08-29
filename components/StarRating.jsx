import React from 'react'; 
import { StarIcon } from '@heroicons/react/16/solid';

const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<StarIcon key={i} className="text-yellow-400 h-4 w-4" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='h-4 w-4 '> <path fill='#FACC15' d="M288 376.4l.1-.1 26.4 14.1 85.2 45.5-16.5-97.6-4.8-28.7 20.7-20.5 70.1-69.3-96.1-14.2-29.3-4.3-12.9-26.6L288.1 86.9l-.1 .3 0 289.2zm175.1 98.3c2 12-3 24.2-12.9 31.3s-23 8-33.8 2.3L288.1 439.8 159.8 508.3C149 514 135.9 513.1 126 506s-14.9-19.3-12.9-31.3L137.8 329 33.6 225.9c-8.6-8.5-11.7-21.2-7.9-32.7s13.7-19.9 25.7-21.7L195 150.3 259.4 18c5.4-11 16.5-18 28.8-18s23.4 7 28.8 18l64.3 132.3 143.6 21.2c12 1.8 22 10.2 25.7 21.7s.7 24.2-7.9 32.7L438.5 329l24.6 145.7z" /></svg>);
    } else {
      stars.push(<StarIcon key={i} className='h-4 w-4 text-gray-400'/>);
    }
  }

  return (
    <div className="flex items-center">
      {stars}  
    </div>
  );
};

export default StarRating;
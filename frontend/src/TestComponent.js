import React, { useContext } from 'react';
import { BlockingContext } from './App';

const TestComponent = () => {

  const handleBlocking = useContext(BlockingContext);
  const handleClick = () => {
    console.log('Button clicked');
    handleBlocking(true);
    setTimeout(() => {
      handleBlocking(false);
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleClick}>Test Button</button>
    </div>
  );
};

export default TestComponent;

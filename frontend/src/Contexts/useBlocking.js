import { useState, useCallback } from 'react';

const useBlocking = () => {
  const [blocking, setBlocking] = useState(false);

  const handleBlocking = useCallback((value) => {
    setBlocking(value);
  }, []);

  return [blocking, handleBlocking];
};

export default useBlocking;

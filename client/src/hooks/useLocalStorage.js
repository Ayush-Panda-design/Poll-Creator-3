import { useState } from 'react';
import * as storage from '../utils/storage';

/** Syncs state to localStorage automatically */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const item = storage.get(key);
    return item !== null ? item : initialValue;
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storage.set(key, valueToStore);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;

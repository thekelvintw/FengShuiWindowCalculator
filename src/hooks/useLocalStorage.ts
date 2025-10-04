import { useState, useEffect } from 'react';
import { MAX_GUEST_RECORDS } from '../constants';

export function useLocalStorage<T extends { id: string }>(key: string, initialValue: T[]): [T[], (value: T) => boolean, (id: string) => void, (value: T) => void, (newRecords: T[]) => void] {
  const [storedValue, setStoredValue] = useState<T[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, storedValue]);

  const addValue = (value: T): boolean => {
    let success = false;
    setStoredValue(prev => {
      if (prev.length >= MAX_GUEST_RECORDS) {
        success = false;
        return prev;
      }
      success = true;
      return [value, ...prev];
    });
    return success;
  };

  const removeValue = (id: string) => {
    setStoredValue(prev => prev.filter(item => item.id !== id));
  };
  
  const updateValue = (value: T) => {
    setStoredValue(prev => {
      const index = prev.findIndex(item => item.id === value.id);
      if (index === -1) return prev; // Or add if not found? Current behavior is update only.
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  const setAllValues = (newRecords: T[]) => {
    setStoredValue(newRecords);
  }

  return [storedValue, addValue, removeValue, updateValue, setAllValues];
}

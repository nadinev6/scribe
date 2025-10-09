import { useState, useRef, useCallback } from 'react';

interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

interface HistoryManager {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  updateHistory: (newValue: string) => void;
  resetHistory: (initialValue: string) => void;
  present: string;
}

const MAX_HISTORY = 50;
const DEBOUNCE_DELAY = 500;

export const useHistoryManager = (initialValue: string): HistoryManager => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialValue,
    future: [],
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSavedValue = useRef<string>(initialValue);

  const updateHistory = useCallback((newValue: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setHistory((prev) => ({ ...prev, present: newValue }));

    debounceTimer.current = setTimeout(() => {
      if (newValue !== lastSavedValue.current) {
        setHistory((prev) => {
          const newPast = [...prev.past, lastSavedValue.current];
          if (newPast.length > MAX_HISTORY) {
            newPast.shift();
          }
          lastSavedValue.current = newValue;
          return {
            past: newPast,
            present: newValue,
            future: [],
          };
        });
      }
    }, DEBOUNCE_DELAY);
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;
      const newFuture = [prev.present, ...prev.future];

      lastSavedValue.current = newPresent;

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;
      const newPast = [...prev.past, prev.present];

      lastSavedValue.current = newPresent;

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const resetHistory = useCallback((newInitialValue: string) => {
    lastSavedValue.current = newInitialValue;
    setHistory({
      past: [],
      present: newInitialValue,
      future: [],
    });
  }, []);

  return {
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo,
    redo,
    updateHistory,
    resetHistory,
    present: history.present,
  };
};

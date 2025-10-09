import { useRef, useEffect } from 'react';

interface TextareaPosition {
  selectionStart: number;
  selectionEnd: number;
  scrollTop: number;
}

export const useTextareaState = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  value: string
) => {
  const positionRef = useRef<TextareaPosition>({
    selectionStart: 0,
    selectionEnd: 0,
    scrollTop: 0,
  });

  const savePosition = () => {
    if (textareaRef.current) {
      positionRef.current = {
        selectionStart: textareaRef.current.selectionStart,
        selectionEnd: textareaRef.current.selectionEnd,
        scrollTop: textareaRef.current.scrollTop,
      };
    }
  };

  const restorePosition = () => {
    if (textareaRef.current) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const { selectionStart, selectionEnd, scrollTop } = positionRef.current;
          textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
          textareaRef.current.scrollTop = scrollTop;
        }
      });
    }
  };

  useEffect(() => {
    restorePosition();
  }, [value]);

  return { savePosition, restorePosition };
};

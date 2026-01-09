import { useEffect } from 'react';

export const useTabTitle = (activeTitle: string, awayTitle: string) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title = document.visibilityState === 'visible' ? activeTitle : awayTitle;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = activeTitle;
    };
  }, [activeTitle, awayTitle]);
};

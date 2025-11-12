import React, { useEffect, useState } from 'react';

// Persist and apply theme preference (light/dark)
function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  // Default to light if not set
  return 'light';
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={toggle}
      className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center"
      aria-label="Toggle dark mode"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        // Sun icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-0 sm:mr-2"><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3A.75.75 0 0112 2.25zm0 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V18a.75.75 0 01.75-.75zm9-6a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5H20.25a.75.75 0 01.75.75zm-15 0a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM17.657 5.343a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.061-1.061zM6.343 16.243a.75.75 0 011.06 0l1.061 1.06a.75.75 0 11-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zM18.718 16.243a.75.75 0 010 1.06l-1.061 1.061a.75.75 0 11-1.06-1.06l1.06-1.061a.75.75 0 011.061 0zM7.404 5.343a.75.75 0 010 1.06L6.343 7.464a.75.75 0 01-1.06-1.061l1.06-1.06a.75.75 0 011.06 0z" clipRule="evenodd"/></svg>
      ) : (
        // Moon icon
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-0 sm:mr-2"><path d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 1113.75 2.25a.75.75 0 01.563 1.265 8.25 8.25 0 007.439 11.487z"/></svg>
      )}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

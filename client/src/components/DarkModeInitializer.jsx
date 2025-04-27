import { useEffect } from 'react';

const DarkModeInitializer = () => {
  useEffect(() => {
    // Set dark mode globally
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-gray-900', 'text-white');
    
    // Override any conflicting styles by adding these classes to all necessary elements
    const applyDarkStyles = () => {
      // Apply to common elements that might have light backgrounds
      document.querySelectorAll('.bg-white, .bg-gray-50, .bg-gray-100, .bg-gray-200').forEach(el => {
        el.classList.add('dark-element');
      });
      
      // Apply to form elements
      document.querySelectorAll('input, textarea, select').forEach(el => {
        el.classList.add('dark-input');
      });
      
      // Fix tables with light backgrounds
      document.querySelectorAll('table, tr, td, th').forEach(el => {
        el.classList.add('dark-table-element');
      });
    };
    
    // Run initially
    applyDarkStyles();
    
    // Set up an observer to detect new DOM elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          applyDarkStyles();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Cleanup on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return null; // This is a utility component with no UI
};

export default DarkModeInitializer;

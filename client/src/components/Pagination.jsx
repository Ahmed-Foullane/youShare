import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { current_page, last_page } = pagination;
  
  if (last_page <= 1) {
    return null;
  }
  
  const createPaginationArray = () => {
    const pages = [];
    
    pages.push(1);
    
    let startPage = Math.max(2, current_page - 1);
    let endPage = Math.min(last_page - 1, current_page + 1);
    
    if (startPage > 2) {
      pages.push('...');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < last_page - 1) {
      pages.push('...');
    }
    
    if (last_page > 1) {
      pages.push(last_page);
    }
    
    return pages;
  };
  
  const pages = createPaginationArray();
  
  return (
    <div className="flex justify-center my-6">
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className={`px-3 py-1 rounded-md ${
            current_page === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          &laquo;
        </button>
        
        {/* Page Numbers */}
        {pages.map((page, index) => (
          <React.Fragment key={`page-${index}`}>
            {page === '...' ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
        
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className={`px-3 py-1 rounded-md ${
            current_page === last_page
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
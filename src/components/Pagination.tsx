import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  // Ensure totalPages is at least 1 to handle cases with no results
  const displayedTotalPages = totalPages < 1 ? 1 : totalPages;

  return (
    <div className="pagination">
      <button onClick={handlePrevious} disabled={currentPage === 0}>
        Previous
      </button>
      <span>
        Page {currentPage + 1} of {displayedTotalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage >= totalPages - 1 || totalPages < 1}>
        Next
      </button>
    </div>
  );
};

export default Pagination;



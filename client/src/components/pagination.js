import React from 'react';

const Pagination = ({ vehiclesPerPage, totalVehicles, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalVehicles / vehiclesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-3">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link" style={{ cursor: 'pointer' }}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

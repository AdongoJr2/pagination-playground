import { useState, useEffect } from 'react';
import './App.css';
import Pagination from './components/Pagination';
import sampledata from './data/sampledata';

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [currentCountries, setCurrentCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    setAllCountries(sampledata);
  }, []);

  const onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentCountries = allCountries.slice(offset, offset + pageLimit);

    setCurrentPage(currentPage);
    setCurrentCountries(currentCountries);
    setTotalPages(totalPages);
  };

  const totalCountries = allCountries.length;
  if (totalCountries === 0) return null;
  const headerClass = ['text', currentPage ? 'text text-current-page' : ''].join(' ').trim();

  return (
    <div className="Ap">
      <h1>Pagination</h1>

      <h4 className={headerClass}>
        <strong>{totalCountries}</strong>
      </h4>

      { currentPage && (
        <span className="current-page">
          Page <span>{currentPage}</span>
          /
          <span>{totalPages}</span>
        </span>
      )}

      <div>
        <Pagination totalRecords={totalCountries} pageLimit={3} pageNeighbours={1} onPageChanged={onPageChanged} />
      </div>

      {currentCountries.map((currentCountry, index) => {
        return (
          <p key={index}>{currentCountry}</p>
        );
      })}

    </div>
  );
}

export default App;

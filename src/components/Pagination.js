import { Fragment, useState, useEffect } from 'react';

import styles from './Pagination.module.scss';

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

const Pagination = (props) => {
  const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = props;

  const pageLimit2 = typeof pageLimit === 'number' ? pageLimit : 30;
  const totalRecords2 = typeof totalRecords === 'number' ? totalRecords : 0;
  // page neighbours can be 0, 1 or 2
  const pageNeighbours2 = typeof pageNeighbours === 'number'
    ? Math.max(0, Math.min(pageNeighbours, 2))
    : 0;
  const totalPages = Math.ceil(totalRecords2 / pageLimit2);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchNumbers = () => {
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = (pageNeighbours2 * 2) + 3;
    const totalBlocks = totalNumbers + 2;

    // console.log("Tot numbers ->", totalNumbers)
    // console.log("Tot blocks ->", totalBlocks)
    // console.log("Tot pages ->", totalPages)

    if (totalPages > totalBlocks) {
      // console.log("Curr. page ->", currentPage)
      // console.log("Page nei. ->", pageNeighbours2)

      const startPage = Math.max(2, currentPage - pageNeighbours2);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours2);
      let pages = range(startPage, endPage);

      // console.log("Start page ->", startPage)
      // console.log("End page ->", endPage)
      // console.log("pages ->", pages)

      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (totalPages - endPage) > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      // console.log("Has LS ->", hasLeftSpill)
      // console.log("has RS ->", hasLeftSpill)
      // console.log("Spill offset ->", spillOffset)


      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          // console.log("Extra pages ->", extraPages)
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill): {
          //   const extraPages = range(endPage + 1, endPage + spillOffset);
          //   pages = [...pages, ...extraPages, RIGHT_PAGE];
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }

        default: {
          // pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          pages = [...pages, ];
          break;
        }

      }

      // console.log("Pages ->", pages)

      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  const goToPage = (page) => {
    const { onPageChanged = f => f } = props;
    const currentPage = Math.max(0, Math.min(page, totalPages));
    const paginationData = {
      currentPage,
      totalPages,
      pageLimit: pageLimit2,
      totalRecords: totalRecords2,
    };

    onPageChanged(paginationData);
    setCurrentPage(currentPage);
  };

  useEffect(() => {
    goToPage(1);
  }, []);

  const handleClick = (e, page) => {
    e.preventDefault();
    goToPage(page);
  };

  const handleMoveLeft = (e) => {
    e.preventDefault();
    const page = currentPage - (pageNeighbours2 * 2) + 1;
    goToPage(page);
  };

  const handleMoveRight = (e) => {
    e.preventDefault();
    goToPage(currentPage - (pageNeighbours2 * 2) + 3);
  };

  const pages = fetchNumbers();
  // console.log("Pages ->", pages);
  if (!totalRecords2 || totalPages === 1) return null;

  return (
    <Fragment>
      <div className={styles["pagination"]}>
        <div className={styles["pages"]}>
          {pages.map((page, index) => {
            if (page === LEFT_PAGE) return (
              <span key={index} className={styles["page-item"]} onClick={(e) => handleMoveLeft(e)}>
                {/* <span className="page-link">Previous</span> */}
                <span className="page-link">&laquo;</span>
              </span>
            );

            if (page === RIGHT_PAGE) return (
              <span key={index} className={styles["page-item"]} onClick={(e) => handleMoveRight(e)}>
                <span className="page-link">&raquo;</span>
              </span>
            );

            return (
              <span key={index} className={`${styles["page-item"]} ${currentPage === page ? styles["page-item-active"] : ''}`} onClick={(e) => handleClick(e, page)}>
                <span className="page-link">{page}</span>
              </span>
            );

          })}
        </div>
      </div>
    </Fragment>
  );
};

export default Pagination;
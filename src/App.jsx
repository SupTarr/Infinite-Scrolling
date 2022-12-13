import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";
import './index.css'

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  useBookSearch(query, pageNumber);
  return (
    <>
      <h1>Book Searching</h1>
      <input type="text" onChange={handleSearch} />
      {books.map((book, index) => {
        if (Math.ceil(books.length * 0.9) === index + 1) {
          return (
            <div ref={lastBookElementRef} key={index}>
              {book}
            </div>
          );
        } else {
          return <div key={index}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}

export default App;

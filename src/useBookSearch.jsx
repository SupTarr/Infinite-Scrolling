import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const getData = setTimeout(() => {
      axios({
        method: "GET",
        url: "https://openlibrary.org/search.json",
        // q = search term & page = page number in the API
        params: { q: query, page: pageNumber },
      })
        .then((res) => {
          setBooks((prevBooks) => {
            return [
              // Use set to remove duplicates and spread to add into array
              ...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)]),
            ];
          });
          setHasMore(res.data.docs.length > 0);
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setError(true);
        });
    }, 1000);
    return () => clearTimeout(getData);
  }, [query, pageNumber]);
  
  return { loading, error, books, hasMore };
}

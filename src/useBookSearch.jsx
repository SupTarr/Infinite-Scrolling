import { useEffect, useState } from "react";
import axios from "axios";

export default function useBookSearch(query, pageNumber) {
  useEffect(() => {
    let cancel;
    axios({
      method: "GET",
      url: "http://openlibrary.org/search.json",
      // q = search term and page = page number in the API
      params: { q: query, page: pageNumber },
      // Use the cancelToken to cancel the previous request
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
    return () => cancel();
  }, [query, pageNumber]);
  return null;
}

const { useState } = React;

const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData
    });
  
    useEffect(() => {
      let didCancel = false;
      
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }
  };

  function App() {
   
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState("jack johnson");
    const [{ data, isLoading, isError}, doFetch] = useDataApi(`https://itunes.apple.com/search?term=${query}&entity=song`,
    {results: []}

    );
    

    //calculamos el número total de páginas 
    const itemsPerPage = 10; // Número de resultados por página
    const totalResults = data.results.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const slicedData = data.results.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (

    <div className="container mt-5">
      <h1 claseName="text-center mb-4">iTunes Search</h1>

        <form 
             onSubmit={(event) => {
                doFetch(`https://itunes.apple.com/search?term=${query}&entity=song`);
                event.preventDefault();
            }}
            >
              <div className="input-group mb-3">
            <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="form-control"
            placeholder="Search for songs..."
            />
            <div className="input-group-append">
            <button type="submit" className="btn btn-primary">Search</button>
            </div>
            </div>
        </form>

        {isError && <div>Something went wrong ...</div>}

        {isLoading ? (
            <div>Loading ...</div>
        ) : (
          <>
            <ul className="list-group">
            {slicedData.map((item) => (
                <li key={item.trackId} className="list-group-item">
                <a href={item.trackViewUrl}>{item.trackName}</a>
                </li>
            ))}
            </ul>

              <nav arial-label="Page navigtion">
                <ul className="pagination mt-3">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                      Previous
                    </button>
                  </li>
                  {/* Generar dinámicamente los elementos de la paginación */}
                  {Array.from({length: totalPages}, (_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index+1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link"onClick={() => handlePageChange(currentPage+1)}>
                    Next
                    </button>
                  </li>
                </ul>
              </nav>
           </>
        )}
   </div> 
    );
   }

  ReactDOM.render(<App />, document.getElementById("root"));
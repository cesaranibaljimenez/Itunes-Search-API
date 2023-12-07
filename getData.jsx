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
    const [query, setQuery] = useState("jack johnson");
    const [{ data, isLoading, isError}, doFetch] = useDataApi(`https://itunes.apple.com/search?term=${query}&entity=song`,
    {results: []}

    );

    return (

    <div className="container mt-5">
      <h1 claseName="text-center mb-4">iTunes Search</h1>

        <form 
          className="mb-4"
             onSubmit={(event) => {
                doFetch(`https://itunes.apple.com/search?term=${query}&entity=song`);
                event.preventDefault();
            }}
            >
              <div className="imput-group">
            <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            <ul>
            {data.results.map((item) => (
                <li key={item.trackId}>
                <a href={item.trackViewUrl}>{item.trackName}</a>
                </li>
            ))}
            </ul>
        )}

    </div>

    );

  }

  // ========================================

  ReactDOM.render(<App />, document.getElementById("root"));
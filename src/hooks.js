import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

function useFetch(request) {
  const [resp, setResp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(function() {
    async function getData() {
      try {
        const res = await request;
        setResp(res);
        setIsLoading(false);
      } catch (e) {
        swal("Oops, not found");
        history.push("/");
        console.log(e);
      }
    }
    getData();
  }, []);

  return [resp, isLoading, setResp];
}

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      let value = JSON.parse(window.localStorage.getItem(key) || defaultValue);
      return value;
    } catch (e) {
      throw new Error(e);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}


export { useFetch, useLocalStorageState };

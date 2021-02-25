import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios from 'axios';

const useFetch = <T>(
  method: 'POST' | 'GET',
  url: string,
  object?: any //eslint-disable-line
): [
  T,
  'Loading' | 'Rendered' | 'Error',
  Dispatch<SetStateAction<'Loading' | 'Rendered' | 'Error'>>
] => {
  const [data, setData] = useState<T>();
  const [compState, setCompState] = useState<'Loading' | 'Rendered' | 'Error'>('Loading');

  useEffect(() => {
    let isMounted = true;
    setCompState('Loading');
    if (method === 'GET') {
      axios
        .get(url)
        .then(res => {
          if (isMounted) {
            setData(res.data);
            setCompState('Rendered');
          }
        })
        .catch(err => {
          if (isMounted) {
            setCompState('Error');
            setData(err);
          }
        });
    } else if (
      method === 'POST' &&
      object !== null &&
      !Object.values(object).includes(null)
    ) {
      axios
        .post(url, object)
        .then(res => {
          if (isMounted) {
            setData(res.data);
            setCompState('Rendered');
          }
        })
        .catch(err => {
          if (isMounted) {
            setCompState('Error');
            setData(err);
          }
        });
    } else return;

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(object), method]); //eslint-disable-line

  return [data as T, compState, setCompState];
};

export default useFetch;

import { useState, useEffect, SetStateAction, Dispatch } from 'react';
import axios, { AxiosResponse } from 'axios';

const useFetch = (
  method: 'POST' | 'GET',
  url: string,
  object?: any //eslint-disable-line
): [
  AxiosResponse,
  'Loading' | 'Rendered' | 'Error',
  Dispatch<SetStateAction<'Loading' | 'Rendered' | 'Error'>>
] => {
  const [data, setData] = useState<AxiosResponse | null | void>(null);
  const [compState, setCompState] = useState<'Loading' | 'Rendered' | 'Error'>('Loading');

  useEffect(() => {
    let isMounted = true;
    setCompState('Loading');
    if (method === 'GET') {
      axios
        .get(url)
        .then(res => {
          if (isMounted) {
            setCompState('Rendered');
            setData(res);
          }
        })
        .catch(err => {
          if (isMounted) {
            setCompState('Error');
            setData(err);
            // console.log(err);
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
            setCompState('Rendered');
            setData(res);
          }
        })
        .catch(err => {
          if (isMounted) {
            // console.log(err);
            setCompState('Error');
            setData(err);
          }
        });
    } else return;

    return () => {
      isMounted = false;
    };
  }, [url, JSON.stringify(object)]); // eslint-disable-line

  return [data as AxiosResponse, compState, setCompState];
};

export default useFetch;

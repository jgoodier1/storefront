import React from 'react';
import classes from '../css/Spinner.module.css';

const Spinner: React.FC = () => {
  return <div className={classes.loader}>Loading...</div>;
};

export default Spinner;

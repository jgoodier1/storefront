// NOT BEING USED

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import axios from 'axios';

import Button from '../components/Button';
import Modal from '../components/Modal';

interface MyFormValues {
  title: string;
  image: string;
  price: string;
  description: string;
}

const ProductForm: React.FC = () => {
  const [initialValues, setInitailValues] = useState({
    title: '',
    image: '',
    price: '',
    description: ''
  });
  const [editingState, setEditingState] = useState(false);
  const [compState, setCompState] = useState<'Loading' | 'Rendered' | 'Error'>(
    'Rendered'
  );

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === '/admin/edit-product') {
      setEditingState(true);
    } else if (location.pathname === '/admin/add-product') {
      setEditingState(false);
    }
  }, [location]);

  useEffect(() => {
    if (editingState) {
      setCompState('Loading');
      axios
        .get('/admin/edit-product' + location.search)
        .then(res => {
          setCompState('Rendered');
          setInitailValues({
            title: res.data.title,
            image: res.data.image,
            price: res.data.price,
            description: res.data.description
          });
        })
        .catch(() => {
          setCompState('Error');
        });
    } else if (editingState === false) {
    }
  }, [location.search, editingState]); //eslint-disable-line

  const onAddSubmitHandler = (values: MyFormValues) => {
    setCompState('Loading');
    const newProduct = {
      title: values.title,
      image: values.image,
      price: values.price,
      description: values.description
    };
    axios
      .post('/admin/add-product', newProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        setCompState('Rendered');
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setCompState('Error');
        console.error(err.response.data);
      });
  };

  const onEditSubmitHandler = (values: MyFormValues) => {
    setCompState('Loading');
    const updatedProduct = {
      title: values.title,
      image: values.image,
      price: values.price,
      description: values.description,
      id: location.search.split('=')[1]
    };
    axios
      .post('/admin/edit-product', updatedProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        setCompState('Rendered');
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setCompState('Error');
        console.error(err.response.data);
      });
  };

  return (
    <>
      {compState === 'Error' && (
        <Modal show={compState === 'Error'}>
          <h2>Error</h2>
          An error occurred. Please try again in a moment
        </Modal>
      )}
      <Formik
        initialValues={initialValues}
        // onSubmit={ values => {
        //   alert(JSON.stringify(values, null, 2));
        // }}
        onSubmit={values => {
          !editingState ? onAddSubmitHandler(values) : onEditSubmitHandler(values);
        }}
      >
        <ExtendedForm>
          <h2>{!editingState ? 'Add Product' : 'Edit Product'}</h2>
          <label htmlFor='title'>Title</label>
          <Field id='title' name='title' type='text' />
          <label htmlFor='image'>Image URL</label>
          <Field id='image' name='image' type='text' />
          <label htmlFor='price'>Price</label>
          <Field id='price' name='price' type='text' />
          <label htmlFor='description'>Description</label>
          <Field id='description' name='description' type='text' as='textarea' />
          <Button type='submit'>Submit</Button>
        </ExtendedForm>
      </Formik>
    </>
  );
};

export default ProductForm;

const ExtendedForm = styled(Form)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  margin: 100px auto;
  width: 500px;
  text-align: center;
  border: 1px solid #eee;
  padding: 10px;
`;

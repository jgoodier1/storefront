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

const ProductForm = () => {
  const [initialValues, setInitailValues] = useState({
    title: '',
    image: '',
    price: '',
    description: ''
  });
  const [editingState, setEditingState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === '/admin/edit-product') {
      setEditingState(true);
    } else if (location.pathname === '/admin/add-product') {
      setEditingState(false);
    }
  }, [location]);

  // let intialValues: MyFormValues = { title: '', image: '', price: '', description: '' };

  useEffect(() => {
    if (editingState) {
      axios
        .get('/admin/edit-product' + location.search)
        .then(res => {
          // console.log(res.data);
          setInitailValues({
            title: res.data.title,
            image: res.data.image,
            price: res.data.price,
            description: res.data.description
          });
          // initialValues.title = res.data.title;
          // initialValues.image = res.data.image;
          // initialValues.price = res.data.price;
          // initialValues.description = res.data.description;
        })
        .catch(err => {
          setError(err.response.data);
          setShowModal(true);
        });
    } else if (editingState === false) {
      // setTitleValue('');
      // setImageValue('');
      // setPriceValue('');
      // setDescValue('');
    }
  }, [location.search, editingState]); //eslint-disable-line

  const onAddSubmitHandler = (
    /*event: React.FormEvent<HTMLFormElement>*/ values: MyFormValues
  ) => {
    // event.preventDefault();

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
        console.log('Axios res', res);
        console.log('Axios res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setShowModal(true);
        setError('An error occurred. Please try again in a moment.');
        console.log(err.response.data);
      });
  };

  const onEditSubmitHandler = (
    /*event: React.FormEvent<HTMLFormElement>*/ values: MyFormValues
  ) => {
    // event.preventDefault();

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
        console.log('Axios res', res);
        console.log('Axios res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setShowModal(true);
        setError('An error occurred. Please try again in a moment.');
      });
  };

  const modalClosed = () => {
    setShowModal(false);
    history.push('/admin/products');
  };

  return (
    <>
      <Modal show={showModal} modalClosed={modalClosed}>
        <StyledButton onClick={modalClosed}>X</StyledButton>
        <h2>Error</h2>
        {error}
      </Modal>
      <Formik
        initialValues={initialValues}
        // onSubmit={ values => {
        //   alert(JSON.stringify(values, null, 2));
        // }}
        onSubmit={values => {
          !editingState ? onAddSubmitHandler(values) : onEditSubmitHandler(values);
        }}
      >
        <StyledForm>
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
        </StyledForm>
      </Formik>
    </>
  );
};

export default ProductForm;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  margin: 100px auto;
  width: 500px;
  text-align: center;
  ${'' /* box-shadow: 0 2px 3px #ccc; */}
  border: 1px solid #eee;
  padding: 10px;
`;

const StyledButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: 0;
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
`;

// const [controlsState, setControlsState] = useState({
//   title: {
//     elementType: 'input',
//     elementConfig: {
//       type: 'text',
//     },
//     label: 'Product Title: ',
//     value: '',
//   },
//   image: {
//     elementType: 'input',
//     elementConfig: {
//       type: 'url',
//     },
//     label: 'Image URL: ',
//     value: '',
//   },
//   price: {
//     elementType: 'input',
//     elementConfig: {
//       type: 'number',
//     },
//     label: 'Price: ',
//     value: '',
//   },
//   description: {
//     elementType: 'textarea',
//     elementConfig: {
//       name: 'description',
//       htmlFor: 'description',
//     },
//     label: 'Description: ',
//     value: '',
//   },
// });

// const formElementsArray = [];
// for (let key in controlsState) {
//   formElementsArray.push({
//     id: key,
//     config: controlsState[key],
//   });
// }

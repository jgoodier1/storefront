import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Input, TextArea } from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';

const ProductForm = () => {
  const [titleValue, setTitleValue] = useState('');
  const [imageValue, setImageValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [descValue, setDescValue] = useState('');
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

  useEffect(() => {
    if (editingState) {
      axios
        .get('/admin/edit-product' + location.search)
        .then(res => {
          console.log(res.data);
          setTitleValue(res.data.title);
          setImageValue(res.data.image);
          setPriceValue(res.data.price);
          setDescValue(res.data.description);
        })
        .catch(err => {
          setError(err.response.data);
          setShowModal(true);
        });
    } else if (editingState === false) {
      setTitleValue('');
      setImageValue('');
      setPriceValue('');
      setDescValue('');
    }
  }, [location.search, editingState]); //eslint-disable-line

  const onAddSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProduct = {
      title: titleValue,
      image: imageValue,
      price: priceValue,
      description: descValue
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

  const onEditSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedProduct = {
      title: titleValue,
      image: imageValue,
      price: priceValue,
      description: descValue,
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

  let form = (
    <>
      <Input
        type='text'
        value={titleValue || ''} // the || makes it controlled
        name='title'
        id='title'
        changed={(event: React.FormEvent<HTMLInputElement>) =>
          setTitleValue(event.currentTarget.value)
        }
        label='Title'
      />
      <Input
        type='text'
        value={imageValue || ''} // the || makes it controlled
        changed={(event: React.FormEvent<HTMLInputElement>) =>
          setImageValue(event.currentTarget.value)
        }
        name='imageurl'
        id='imageurl'
        label='Image URL'
      />
      <Input
        type='number'
        value={priceValue || ''} // the || makes it controlled
        changed={(event: React.FormEvent<HTMLInputElement>) =>
          setPriceValue(event.currentTarget.value)
        }
        name='price'
        id='price'
        label='Price'
      />
      <TextArea
        value={descValue || ''}
        changed={(event: React.FormEvent<HTMLTextAreaElement>) =>
          setDescValue(event.currentTarget.value)
        }
        name='desc'
        id='desc'
        label='Description'
        rows={'8'}
      />
    </>
  );

  return (
    <>
      <Modal show={showModal} modalClosed={modalClosed}>
        <StyledButton onClick={modalClosed}>X</StyledButton>
        <h2>Error</h2>
        {error}
      </Modal>
      <StyledForm
        // action='/admin/add-product'
        // method='POST'
        onSubmit={!editingState ? onAddSubmitHandler : onEditSubmitHandler}
      >
        <h2>{!editingState ? 'Add Product' : 'Edit Product'}</h2>
        {form}
        <Button type='submit'>Submit</Button>
        {/* the button might not work now due to props (type)*/}
      </StyledForm>
    </>
  );
};

export default ProductForm;

const StyledForm = styled.form`
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

import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { Input, TextArea } from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const ProductForm = props => {
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

  const [titleValue, setTitleValue] = useState('');
  const [imageValue, setImageValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [editingState, setEditingState] = useState(false);

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
        .catch(err => console.error(err));
    } else if (editingState === false) {
      setTitleValue('');
      setImageValue('');
      setPriceValue('');
      setDescValue('');
    }
  }, [location.search, editingState]); //eslint-disable-line

  const onAddSubmitHandler = event => {
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
      .catch(err => console.error(err));
  };

  const onEditSubmitHandler = event => {
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
        console.error(err);
      });
  };

  // const formElementsArray = [];
  // for (let key in controlsState) {
  //   formElementsArray.push({
  //     id: key,
  //     config: controlsState[key],
  //   });
  // }

  let form = (
    <>
      <Input
        type='text'
        value={titleValue || ''} // the || makes it controlled
        name='title'
        changed={event => setTitleValue(event.target.value)}
        label='Title'
      />
      <Input
        type='text'
        value={imageValue || ''} // the || makes it controlled
        changed={event => setImageValue(event.target.value)}
        name='imageurl'
        label='Image URL'
      />
      <Input
        type='number'
        value={priceValue || ''} // the || makes it controlled
        changed={event => setPriceValue(event.target.value)}
        name='price'
        label='Price'
      />
      <TextArea
        value={descValue || ''}
        changed={event => setDescValue(event.target.value)}
        name='desc'
        label='Description'
        rows={'8'}
      />
    </>
  );

  return (
    <>
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

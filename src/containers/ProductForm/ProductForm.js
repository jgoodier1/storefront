import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const ProductForm = (props) => {
  const [controlsState, setControlsState] = useState({
    title: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
      },
      label: 'Product Title: ',
      value: '',
    },
    image: {
      elementType: 'input',
      elementConfig: {
        type: 'url',
      },
      label: 'Image URL: ',
      value: '',
    },
    price: {
      elementType: 'input',
      elementConfig: {
        type: 'number',
      },
      label: 'Price: ',
      value: '',
    },
    description: {
      elementType: 'textarea',
      elementConfig: {
        name: 'description',
        htmlFor: 'description',
      },
      label: 'Description: ',
      value: '',
    },
  });

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
        .then((res) => {
          console.log(res.data);
          const updatedControls = {
            ...controlsState,
            title: {
              ...controlsState.title,
              value: res.data.title,
            },
            image: {
              ...controlsState.image,
              value: res.data.image,
            },
            price: {
              ...controlsState.price,
              value: res.data.price,
            },
            description: {
              ...controlsState.description,
              value: res.data.description,
            },
          };
          setControlsState(updatedControls);
        })
        .catch((err) => console.error(err));
    } else if (editingState === false) {
      const updatedControls = {
        ...controlsState,
        title: {
          ...controlsState.title,
          value: '',
        },
        image: {
          ...controlsState.image,
          value: '',
        },
        price: {
          ...controlsState.price,
          value: '',
        },
        description: {
          ...controlsState.description,
          value: '',
        },
      };
      setControlsState(updatedControls);
    }
  }, [location.search, editingState]); //eslint-disable-line

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...controlsState,
      [controlName]: {
        ...controlsState[controlName],
        value: event.target.value,
      },
    };
    setControlsState(updatedControls);
  };

  const onAddSubmitHandler = (event) => {
    event.preventDefault();

    const newProduct = {
      title: controlsState.title.value,
      image: controlsState.image.value,
      price: controlsState.price.value,
      description: controlsState.description.value,
    };
    axios
      .post('/admin/add-product', newProduct)
      .then((res) => {
        console.log('Axios res', res);
        console.log('Axios res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch((err) => console.error(err));
  };

  const onEditSubmitHandler = (event) => {
    event.preventDefault();

    const updatedProduct = {
      title: controlsState.title.value,
      image: controlsState.image.value,
      price: controlsState.price.value,
      description: controlsState.description.value,
      id: location.search.split('=')[1],
    };
    axios
      .post('/admin/edit-product', updatedProduct)
      .then((res) => {
        console.log('Axios res', res);
        console.log('Axios res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const formElementsArray = [];
  for (let key in controlsState) {
    formElementsArray.push({
      id: key,
      config: controlsState[key],
    });
  }

  let form = formElementsArray.map((formElement) => (
    <Input
      key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value || ''} // the || makes it controlled
      changed={(event) => inputChangedHandler(event, formElement.id)}
      label={formElement.config.label}
    />
  ));

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

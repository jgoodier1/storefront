interface ICart {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
}

export function addToCart(
  id: string,
  price: number,
  quantity: number,
  updateFn: (cart: ICart) => void
) {
  let cart: ICart | null = JSON.parse(sessionStorage.getItem('cart')!);
  console.log(cart);
  if (cart === null) {
    // cart = { products: [{ prodId: 0, price: 0, quantity: 0 }], subTotal: 0 };
    const products = [
      {
        prodId: id,
        price: price,
        quantity: quantity
      }
    ];
    let subTotal = 0;
    products.forEach(p => {
      subTotal += p.quantity * p.price;
    });
    // cart.products = products;
    // cart.subTotal = subTotal;
    cart = { products, subTotal };
    updateFn(cart);
    sessionStorage.setItem('cart', JSON.stringify(cart));
  } else {
    const existingProdId = cart.products.find(p => p.prodId === id);
    if (!existingProdId) {
      cart.products.push({ prodId: id, quantity: +quantity, price: price });
    } else {
      cart.products.map(p => {
        if (p.prodId === id) {
          p.quantity += +quantity;
        }
        return p;
      });
    }
    let subTotal = 0;
    cart.products.forEach(p => {
      subTotal += p.quantity * p.price;
    });
    cart.subTotal = subTotal;
    updateFn(cart);
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }
}

export function addToCart(id, price, quantity, updateFn) {
  let cart = JSON.parse(sessionStorage.getItem('cart')) || undefined;
  if (cart === undefined) {
    cart = {};
    const products = [
      {
        prodId: id,
        quantity: quantity,
        price: price
      }
    ];
    let subTotal = 0;
    products.forEach(p => {
      subTotal += p.quantity * p.price;
    });
    cart.products = products;
    cart.subTotal = subTotal;
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
  }
  updateFn(cart);
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

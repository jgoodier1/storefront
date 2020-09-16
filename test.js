// // let cart = {
// //   products: [
// //     { prodId: 1, quantity: 1, price: 6.99 },
// //     { prodId: 2, quantity: 2, price: 4.99 },
// //     { prodId: 3, quantity: 1, price: 15.99 },
// //   ],
// //   subTotal: 32.96,
// // };

// let products = [
//   { prodId: 1, quantity: 1, price: 6.99 },
//   { prodId: 2, quantity: 2, price: 4.99 },
//   { prodId: 3, quantity: 1, price: 15.99 }
// ];

// // let subtotal = 0;
// // products.forEach(p => {
// //   subtotal += p.quantity * p.price;
// // });
// // console.log(subtotal);

// let productId = 3;

// // let existingProdId = products.find(p => p.prodId === productId);

// let oldProduct = products.filter(p => p.prodId === productId);
// let index = products.indexOf(oldProduct);
// if (index > -1) {
//   products.slice(index, 1);
// }
// const updatedProduct = oldProduct.map(p => p.quantity++);
// console.log(typeof updatedProduct);
// products.push(updatedProduct);
// console.log(updatedProduct);
// console.log(products);

let cart = {
  products: [
    { prodId: 1, quantity: 1, price: 6.99 },
    { prodId: 2, quantity: 2, price: 4.99 },
    { prodId: 3, quantity: 1, price: 15.99 }
  ],
  subTotal: 32.96
};
let productId = 3;
cart.products.map(p => p.prodId === productId && p.quantity++);
console.log(cart);

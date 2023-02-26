/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import Link from 'next/link';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { Store } from '../utils/Store';

export default function ProductItem({ product }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow"
        />
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-3">{product.brand}</p>
        <p className="">$ {product.price}</p>
        <button
          onClick={() => addToCartHandler(product)}
          className="primary-button bg-amber-300"
          type="button"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

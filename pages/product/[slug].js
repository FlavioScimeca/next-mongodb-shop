import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import { Store } from '../../utils/Store';

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <div>Product not found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert('you reach the max items possible');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <>
      <Layout title={product.name}>
        <div className="py-2 ">
          <Link href="/">Back to Homepage</Link>
        </div>
        <div className="grid md:grid-cols-4 md:gap-3">
          <div className="md:col-span-2">
            <Image
              src={product.image}
              alt={product.name}
              width={640}
              height={640}
              layout="responsive"
            />
          </div>

          {/* right side (dentro il grid se no va sotto l Image) */}
          <ul className="text-2xl">
            <li>
              <h1 className="text-3xl">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>
              {product.rating} of {product.numReviews}
            </li>
            <li>Description: {product.description}</li>
          </ul>

          {/* card */}
          <div className="card p-[20px] bg-slate-100 flex flex-col justify-center mx-3 h-fit">
            <div className="mb-2 flex justify-between items-center p-2 border-b-2 border-black">
              <div>Price</div>
              <div>$ {product.price}</div>
            </div>

            {/* status */}
            <div className="mb-2 flex justify-between items-center">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'sold-out'}</div>
            </div>
            {/* button */}
            <button
              className="primary-button w-full bg-amber-300 text-xl font-semibold"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}

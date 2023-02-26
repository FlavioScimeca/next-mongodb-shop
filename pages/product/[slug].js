import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
// import data from '../../utils/data';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);

  const router = useRouter();
  /* 
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug); */
  if (!product) {
    return <Layout title="Product no found">Product not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry, Product is out of stock');
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

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

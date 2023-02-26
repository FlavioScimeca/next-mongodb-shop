import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { signIn, useSession } from 'next-auth/react';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <>
      <Layout title="Login">
        <form
          className="mx-auto max-w-screen-md "
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-xl font-semibold">Login</h1>
          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="w-full p-2"
              id="email"
              autoFocus
              {...register('email', {
                required: 'Please enter email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please enter valid email',
                },
              })}
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="w-full p-2"
              id="password"
              autoFocus
              {...register('password', {
                required: 'Please enter password',
                minLength: {
                  value: 6,
                  message: 'password is more than 5 chars',
                },
              })}
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>

          <div className="mb-[100px] ">
            <button className="primary-button bg-amber-300">Login</button>
          </div>

          <div className="mb-4 h-16 flex gap-4 items-center">
            Dont have an account?
            <Link
              className="p-2 shadow-inner bg-amber-300 rounded-lg"
              href="/register"
            >
              Register here
            </Link>
          </div>
        </form>
      </Layout>
    </>
  );
}

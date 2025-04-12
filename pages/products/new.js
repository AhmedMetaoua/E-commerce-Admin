import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import React from 'react';

export default function NewProduct() {
  return (
    <Layout>
      <h1>New product</h1>
      <ProductForm />
    </Layout>
  );
}

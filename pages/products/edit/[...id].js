import Layout from '@/components/Layout';
import ProductForm from '@/components/ProductForm';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/products?id=' + id).then((Response) => {
      setProductInfo(Response.data);
    });
  }, [id]);
  
  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo && <ProductForm {...productInfo} />}
      
    </Layout>
  );
}

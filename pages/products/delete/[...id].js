import Layout from '@/components/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function DeleteProductPage() {
  const [productInfo, setProductInfo] = useState(null); 
  const router = useRouter();
  const id = router.query.id;
  useEffect(() => {
    if (!id) {
      return ;
    }
    axios.get('/api/products?id=' + id).then((Response) => {
      setProductInfo(Response.data);
    });
  },[id])

  function goBack() {
    router.push('/products')
  }

  async function deleteProduct() {
    await axios.delete('/api/products?id='+id)
    goBack()
  }
  
  return (
    <Layout>
      <h1 className='text-center'>Do you Realy want to delete 
        '{productInfo?.title}' ?
      </h1>
      <div className='flex gap-2 justify-center'>
        <button className='btn-red' onClick={deleteProduct}>Yes</button>
        <button className='btn-default ' onClick={goBack}>NO</button>
      </div>
    </Layout>
  );
}

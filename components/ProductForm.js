import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({
  _id,
  title: oldTitle,
  description: oldDescription,
  price: oldPrice,
  quantity: oldQuantity,
  category: oldCategory,
  images: oldImages = [],
  properties: oldProperties,
}) {
  const [title, setTitle] = useState(oldTitle || '');
  const [description, setDescription] = useState(oldDescription || '');
  const [category,setCategory] = useState(oldCategory || '')
  const [productProperties,setProductProperties] = useState(oldProperties || {})
  const [price, setPrice] = useState(oldPrice || '');
  const [images, setImages] = useState(oldImages || []);
  const [quantity, setQuantity] = useState(oldQuantity || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [categories,setCategories] = useState([])
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(response => {
      setCategories(response.data)
    })
  },[])

  async function saveProduct(e) {
    e.preventDefault();
    const data = { title, description, price: Number(price), images, quantity, category, properties: productProperties };

    try {
      if (_id) {
        // Update product
        await axios.put("/api/products", { ...data, _id });
      } else {
        // Add new product
        await axios.post("/api/products", data);
      }
      setGoToProducts(true);
    } catch (error) {
      console.error("🔥 Axios Error:", error.response?.data || error.message);
    }
  }

  if (goToProducts) {
    router.push('/products');
    return null;
  }

  async function uploadImages(e) {
    const files = e.target.files;
    if (files.length === 0) return;
    
    setIsUploading(true)
    const formDataArray = new FormData();
    for (const file of files) {
      formDataArray.append('files', file);
    }

    try {
      const res = await axios.post('/api/upload', formDataArray, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setImages([...images, ...res.data.links]); // Store uploaded image URLs
      setIsUploading(false)
    } catch (error) {
      console.error("🔥 Upload Error:", error.response?.data || error.message);
    }
  }
  function orderedImages(images) {
    setImages(images)
  }

  function setProductProp(propName,value) {
    setProductProperties( prev => {
      const newProductProp = {...prev}
      newProductProp[propName] = value
      return newProductProp
    })
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category)
    propertiesToFill.push(...catInfo.properties)

    while (catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id)
      propertiesToFill.push(...parentCat.properties)
      catInfo = parentCat
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input 
        placeholder='Product Name' 
        type='text' 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />

      <label>Category</label>
      <select className='mb-0' value={category} onChange={e => setCategory(e.target.value)}>
          <option value='0'>Uncategorized</option>
          {categories.length > 0 && categories.map((item,index) => (
              <option value={item._id} key={index} >{item.name}</option>
          ))}
      </select>

      {propertiesToFill.length > 0 && propertiesToFill.map((pItem,pIndex) => (
        <div key={pIndex} className=''>
          <label>{pItem.name[0].toUpperCase()+pItem.name.substring(1)}</label>
          <div>
            <select value={productProperties[pItem.name]} onChange={(e) => setProductProp(pItem.name, e.target.value)}>
              <option value='select'>select</option>
              {pItem.values.map((vItem,vIndex) => (
                <option value={vItem} key={vIndex}>{vItem}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <label>Photos</label>
      <div className='mb-2 flex gap-1 flex-wrap'>
        <ReactSortable list={images} setList={orderedImages} className='flex flex-wrap gap-1'>
          {images.map((img, index) => (
            <div key={index} className='h-24 bg-white shadow-md rounded-md border border-gray-200' >
              <img src={img} alt={`Uploaded ${index}`} className="w-24 h-24 rounded-md" />

            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className='h-24 flex items-center '>
            <Spinner/>
          </div>)}
        <label className='w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-md bg-gray-100 shadow-md border border-primary '>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <div>Upload</div>
          <input type="file" className='hidden' multiple onChange={uploadImages}/>
        </label>
      </div>

      <label>Quantity</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <label>Product Description</label>
      <textarea 
        placeholder='Description' 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />

      <label>Price in DNT</label>
      <input 
        placeholder='Price' 
        type='number' 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
      />

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => router.push('/products')} className=" btn-default">Cancel</button>
        <button className='btn-primary' type='submit'>Save</button>
      </div>
    </form>
  );
}

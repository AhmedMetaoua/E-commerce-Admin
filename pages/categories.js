import Layout from '@/components/Layout'
import { Category } from '@/models/category'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function Categories() {
    const [name,setName] = useState('')
    const [parentCategory,setParentCategory] = useState('')
    const [categories,setCategories] = useState([])
    const [properties,setProperties] = useState([])
    const [editedCategory,setEditedCategory] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories()
    }, [])

    function fetchCategories() {
        setLoading(true);
        axios.get('/api/categories').then(Response => {
            setCategories(Response.data)
        }).finally(() => {
            setLoading(false); // End loading
        });
    }

    async function saveCategory(e) {
        e.preventDefault();
        const data = {name, parentCategory, properties: properties.map((item) => ({name: item.name, values: item.values.split(',')}))}
        try {
            if (editedCategory) {
              // PUT request for update
              data._id = editedCategory._id;
              await axios.put('/api/categories', data);
            } else {
              // POST request for create
              await axios.post('/api/categories', data);
            }
        
            setName('');
            setParentCategory('');
            setEditedCategory(null);
            setProperties([])
            fetchCategories();
          } catch (err) {
            console.error('⚠️ Error saving category:', err);
          }
    }
    console.log(categories)

    function editCategory(category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(','),
            }))
        )
    }

    function deleteCategory(category) {
        Swal.fire({
            title: 'Are You Sure !',
            text: `Do you want to delete "${category.name}" Category?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, delete !',
            confirmButtonColor: '#d55',
            reverseButtons: true,
          }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        }).catch(error => {
            // when promise rejected...
          });
    }

    function addProperty() {
        setProperties( prev => {
            return [...prev, {name:'', values: ''}]
        })
    }
    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }
    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }
    function removeProperty(indexToRemove) {
        setProperties( (prev) => {
            return prev.filter((p, pIndex) => pIndex !== indexToRemove);
        })
    }

  return (
    <Layout>
        <h1>Categories</h1>
        <label>{editedCategory?'Edit category': 'Create new category'}</label>
        <form onSubmit={saveCategory} >
            <div className='flex gap-1'>
                <input type='text' placeholder='Category name' value={name} onChange={e => setName(e.target.value)}/>
                <select value={parentCategory} onChange={e => setParentCategory(e.target.value)}>
                    <option value='0'>No parent category</option>
                    {categories.length > 0 && categories.map((item,index) => (
                        <option value={item._id} key={index} >{item.name}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2 '>
                <label className='block mb-1'>Proporties</label>
                <button type='button' className='btn-default mb-2' onClick={addProperty}> Add new proporty</button>
                {properties.length > 0 && properties.map((item,index) => (
                        <div className='flex gap-1 mb-2 ' key={index}>
                            <input className='mb-0' type='text' value={item.name} onChange={(e) => handlePropertyNameChange(index, item, e.target.value)} placeholder='Property name (example: color)'/>
                            <input className='mb-0' type='text' value={item.values} onChange={(e) => handlePropertyValuesChange(index, item, e.target.value)} placeholder='Values (example: red, orange, ...)'/>
                            <button className='btn-red' onClick={() => removeProperty(index)} type='button'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    ))}
            </div>
            <div className='flex gap-1'>
                {editedCategory && (
                    <button className='btn-default' type='button' onClick={() => {
                        setEditedCategory(null)
                        setName('')
                        setParentCategory('')
                        setProperties([])
                    }}>Cancel</button>
                )}
                <button type='submit' className='btn-primary py-1'>Save</button>
            </div>
                
        </form>
        {loading ? (
            <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        ) : (  
            <>     
                {!editedCategory && (
                    <table className='basic mt-4'>
                        <thead className=''>
                            <tr>
                                <th>Category name</th>
                                <th>Parent category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(categories) && categories.map((item,index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item?.parent?.name}</td>
                                    <td> 
                                        
                                        <Link href={''} onClick={() => editCategory(item)} className='btn-default mr-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <Link href={''} onClick={() => deleteCategory(item)} className='btn-red'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        )}

    </Layout>
  )
}

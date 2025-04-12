import React, { useEffect, useState } from 'react'
import Layout from './../components/Layout';
import axios from 'axios';

export default function OrdersPage() {

    const [orders,setOrders] = useState([])
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data)
        })
    },[])

  return (
    <Layout>
        <h1>Orders</h1>
        <table className='basic'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Paid</th>
                    <th>Recipient</th>
                    <th>Products</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 && orders.map((order,index) => (
                    <tr key={index}>
                        <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                        <td>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium 
                                ${order.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {order.paid ? 'YES' : 'NO'}
                            </span>
                        </td>

                        <td>
                            {order.name} {order.email}<br/>
                            {order.city} {order.postalCode} {order.country} <br/>
                            {order.streetAddress}
                        </td>
                        <td>
                            {order.line_items?.map((l,index) => (
                                <>
                                    {l.price_data.product_data?.name} X{" "}
                                    <b className="text-xl font-semibold">{l.quantity}</b><br/>
                                </>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
  )
}

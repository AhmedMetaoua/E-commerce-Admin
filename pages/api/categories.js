import React from 'react'
import { Category } from "@/models/Category";
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]"

export default async function handle(req, res) {
    
    const {method} = req ;
    await dbConnect();
    await isAdminRequest(req, res)

    if (method === 'POST') {
        try {
            console.log("🔵 Request Body:", req.body); // Debug log
            const {name, parentCategory, properties} = req.body
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
              }

              let categoryDoc;
              if (parentCategory && parentCategory !== '0') {
                categoryDoc = await Category.create({ name, parent: parentCategory, properties });
              } else {
                categoryDoc = await Category.create({ name, properties });
              }
            res.status(201).json(categoryDoc);

        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: error.message });
        }
    }

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'));
        
    }

    if (method === 'PUT') {
        try {
            console.log("🔵 Request Body:", req.body); // Debug log
            const {name, parentCategory, _id, properties} = req.body
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
              }

              let categoryDoc;
              if (parentCategory && parentCategory !== '0') {
                categoryDoc = await Category.updateOne(
                    {_id},
                    { name, parent: parentCategory, properties });
              } else {
                categoryDoc = await Category.updateOne(
                    {_id},
                    { name, parent: null, properties });
              }

              
              
            res.status(201).json(categoryDoc);

        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: error.message });
        }
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id})
        res.json('ok')
    }
}

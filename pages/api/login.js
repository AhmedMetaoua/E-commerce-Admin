import dbConnect from '../../lib/mongoose';
import Product from '../../models/Product';
import Category from '../../models/Category';
import { isAdminRequest } from './auth/[...nextauth]';
import User from '@/models/User';
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { userName, email, password } = req.body;

            if (!userName || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const userExist = await User.findOne({email}).select('_id')
            if (userExist) {
                res.status(400).json('User already exists !');
                return ;
            }

            const hashedPwd = await bcrypt.hash(password, 8)
            const user = await User.create({userName, email, password: hashedPwd})
            
            res.status(201).json(user);
        } catch (error) {
            console.error('Error registring user:', error);
            res.status(500).json({ error: error.message });
        }
    }


    
    if (req.method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({ _id: req.query.id }));
        } else {
            res.json(await Product.find().populate('category'));
        }
    }


    if (req.method === 'PUT') {
        const { title, price, description, quantity, _id, images, category, properties } = req.body;
        await Product.updateOne({ _id }, { title, price, description, quantity, images, category, properties });

        res.json(true);
    }

    if (req.method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query.id });
        }
        res.json(true);
    }
}

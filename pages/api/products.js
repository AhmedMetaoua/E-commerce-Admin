import dbConnect from '../../lib/mongoose';
import Product from '../../models/Product';
import Category from '../../models/Category';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  await isAdminRequest(req, res)
  
  if (req.method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find().populate('category'));
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, price, description, quantity, images, category, properties } = req.body;

      if (!title || !price) {
        return res.status(400).json({ error: 'Title and price are required' });
      }

      const product = await Product.create({
        title,
        price,
        description,
        quantity,
        images,
        category,
        properties,
      });
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
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

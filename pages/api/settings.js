import dbConnect from '../../lib/mongoose';
import Setting from '../../models/Setting';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const setting = await Setting.findOne({}); // Assuming there's only one settings document
    res.json(setting);
  }

  if (req.method === 'POST') {
    try {
      const { storeName, users, contact, featuredProduct } = req.body;

      const setting = await Setting.create({
        storeName,
        users,
        contact,
        featuredProduct,
      });

      res.status(201).json(setting);
    } catch (error) {
      console.error('Error creating setting:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { _id, ...updates } = req.body;
  
      const updated = await Setting.findByIdAndUpdate(
        _id,
        updates,
        { new: true }
      );
  
      res.json(updated);
    } catch (error) {
      console.error('Error updating setting:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (req.query?.id) {
        await Setting.findByIdAndDelete(req.query.id);
      }
      res.json(true);
    } catch (error) {
      console.error('Error deleting setting:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { type, id } = req.query;

    if (id) {
      // Get single user by ID
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, user });
    }

    // Get all users or filter by type
    const query = type ? { type } : {};
    const users = await User.find(query).select('-password');

    return res.status(200).json({ success: true, users });
  } catch (error: any) {
    console.error('Get users error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch users' });
  }
}


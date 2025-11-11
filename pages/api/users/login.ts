import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email, password, type } = req.body;

    const user = await User.findOne({ email, type });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Don't send password in response
    const userObj = user.toObject();
    const { password: _, ...userResponse } = userObj;

    return res.status(200).json({ success: true, message: 'Login successful!', user: userResponse });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
}


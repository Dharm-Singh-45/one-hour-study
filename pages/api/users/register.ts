import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { type, name, email, password, phone, city, subjects, class: studentClass, experience, qualification } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email, type });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      type,
      name,
      email,
      password,
      phone,
      city,
      subjects: subjects || [],
      ...(type === 'student' && { class: studentClass }),
      ...(type === 'teacher' && { experience, qualification }),
    });

    // Don't send password in response
    const userObj = user.toObject();
    const { password: _, ...userResponse } = userObj;

    return res.status(201).json({ success: true, message: 'Registration successful!', user: userResponse });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
}


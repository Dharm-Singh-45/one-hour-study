import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import AllocationRequest from '@/models/AllocationRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { requesterId, requesterType, requesterName, targetId, targetType, targetName, subjects, message } = req.body;

      // Check if request already exists
      const existingRequest = await AllocationRequest.findOne({
        requesterId,
        targetId,
        status: 'pending',
      });

      if (existingRequest) {
        return res.status(400).json({ success: false, message: 'Request already exists for this pairing' });
      }

      const request = await AllocationRequest.create({
        requesterId,
        requesterType,
        requesterName,
        targetId,
        targetType,
        targetName,
        subjects: subjects || [],
        message,
        status: 'pending',
      });

      return res.status(201).json({ success: true, message: 'Request created successfully!', request });
    } catch (error: any) {
      console.error('Create request error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create request' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { userId, userType } = req.query;

      let query: any = {};
      if (userId && userType) {
        query = { requesterId: userId, requesterType: userType };
      }

      const requests = await AllocationRequest.find(query).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, requests });
    } catch (error: any) {
      console.error('Get requests error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch requests' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}


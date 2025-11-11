import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import AllocationRequest from '@/models/AllocationRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { status, allocationId } = req.body;

    if (!['approved', 'rejected', 'allocated'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateData: any = { status };
    if (status === 'allocated' && allocationId) {
      updateData.allocationId = allocationId;
      updateData.allocatedAt = new Date();
    }

    const request = await AllocationRequest.findByIdAndUpdate(id, updateData, { new: true });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    return res.status(200).json({ success: true, message: 'Request status updated successfully!', request });
  } catch (error: any) {
    console.error('Update request error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update request' });
  }
}


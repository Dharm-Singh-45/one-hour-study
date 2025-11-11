import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Allocation from '@/models/Allocation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { studentId, teacherId, studentName, teacherName, subjects, fees, time, days, startDate, status } = req.body;

      // Check if allocation already exists
      const existingAllocation = await Allocation.findOne({
        studentId,
        teacherId,
        status: 'active',
      });

      if (existingAllocation) {
        return res.status(400).json({ success: false, message: 'Allocation already exists for this student-teacher pair' });
      }

      const allocation = await Allocation.create({
        studentId,
        teacherId,
        studentName,
        teacherName,
        subjects: subjects || [],
        fees,
        time,
        days: days || [],
        startDate: startDate || new Date(),
        status: status || 'active',
      });

      return res.status(201).json({ success: true, message: 'Allocation created successfully!', allocation });
    } catch (error: any) {
      console.error('Create allocation error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to create allocation' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { userId, userType } = req.query;

      let query: any = { status: 'active' };
      if (userId && userType) {
        if (userType === 'student') {
          query.studentId = userId;
        } else {
          query.teacherId = userId;
        }
      }

      const allocations = await Allocation.find(query).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, allocations });
    } catch (error: any) {
      console.error('Get allocations error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch allocations' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}


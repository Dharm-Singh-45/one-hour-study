import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAllocation extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  studentName: string;
  teacherName: string;
  subjects: string[];
  fees: number;
  time: string;
  days: string[];
  startDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const AllocationSchema: Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    studentName: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
      default: [],
    },
    fees: {
      type: Number,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      required: true,
      default: [],
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Allocation: Model<IAllocation> = mongoose.models.Allocation || mongoose.model<IAllocation>('Allocation', AllocationSchema);

export default Allocation;


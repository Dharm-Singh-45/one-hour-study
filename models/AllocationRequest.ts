import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAllocationRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  requesterType: 'student' | 'teacher';
  requesterName: string;
  targetId: mongoose.Types.ObjectId;
  targetType: 'student' | 'teacher';
  targetName: string;
  subjects: string[];
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'allocated';
  allocationId?: mongoose.Types.ObjectId;
  allocatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AllocationRequestSchema: Schema = new Schema(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'requesterType',
    },
    requesterType: {
      type: String,
      required: true,
      enum: ['student', 'teacher'],
    },
    requesterName: {
      type: String,
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
    },
    targetType: {
      type: String,
      required: true,
      enum: ['student', 'teacher'],
    },
    targetName: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
      default: [],
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'allocated'],
      default: 'pending',
    },
    allocationId: {
      type: Schema.Types.ObjectId,
      ref: 'Allocation',
    },
    allocatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const AllocationRequest: Model<IAllocationRequest> =
  mongoose.models.AllocationRequest || mongoose.model<IAllocationRequest>('AllocationRequest', AllocationRequestSchema);

export default AllocationRequest;


import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  type: 'student' | 'teacher';
  email: string;
  password: string;
  name: string;
  phone?: string;
  city?: string;
  subjects?: string[];
  class?: string;
  experience?: string;
  qualification?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['student', 'teacher'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    class: {
      type: String,
    },
    experience: {
      type: String,
    },
    qualification: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for email and type to allow same email for student and teacher
UserSchema.index({ email: 1, type: 1 }, { unique: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;


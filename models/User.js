import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    isAdmin: { type: String, require: true, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

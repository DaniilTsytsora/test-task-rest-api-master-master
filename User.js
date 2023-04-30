// Схема для регистрации юзера.
import mongoose from 'mongoose';
const User = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  types: { type: String },
});

export default mongoose.model('User', User);

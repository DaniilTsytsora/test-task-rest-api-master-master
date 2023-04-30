// Схема для регистрации доктора и дальнейшей записи к нему по Slot.
import mongoose from 'mongoose';

const Slot = new mongoose.Schema({
  date_time: { type: Date, required: true },
});

const Doctor = new mongoose.Schema({
  name: { type: String, required: true },
  spec: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  slots: [Slot],
  types: { type: String, required: true },
});

export default mongoose.model('Doctor', Doctor);

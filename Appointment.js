// Создание схемы для регистрации нашей записи к врачу.
import mongoose from 'mongoose';
const Appointment = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true,
  },
  slot: {
    type: Date,
    required: true,
  },
});
export default mongoose.model('Appointment', Appointment);

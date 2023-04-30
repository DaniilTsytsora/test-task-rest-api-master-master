import User from './User.js'; // Модель юзера
import Doctor from './Doctor.js'; // Модель доктора
import schedule from 'node-schedule';
import winston from 'winston';
import Appointment from './Appointment.js'; // Модель нашей записи к врачу

// Здесь я использую подключенную библиотеку winston и логирую файлы в файл и в консоль(для наглядности)
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'notification.log' }),
  ],
});

// В данном классе я реализую функции для дальнейшей регистрации через API юзеров и докторов и попадания их в бд. А так же регистрирую запись к врачу и присылаю уведомления за день и за 2 часа до указанной даты.
class PostController {
  // Регистрация юзера и проверка на уже использованный номер телефона для регистрации.
  async registrationUser(req, res) {
    try {
      const { phone, name } = req.body;
      const personUser = await User.findOne({ phone });
      if (personUser) {
        return res.status(200).json({ message: 'Registration error(phone)' });
      }

      const newUser = new User({ phone, name, types: 'user' });
      await newUser.save();
      return res.json({ message: 'Succesfull' });
    } catch (e) {
      res.status(400).json({ message: 'Registration error' });
    }
  }
  // Регистрация доктора и проверка на уже использованный номер телефона для регистрации.
  async registrationDoctor(req, res) {
    try {
      const { name, spec, phone, slots } = req.body;
      const personDoc = await Doctor.findOne({ phone });
      if (personDoc) {
        return res.status(200).json({ message: 'Registration error(phone)' });
      }
      const newDoc = new Doctor({
        name,
        spec,
        phone,
        slots,
        types: 'doc',
      });
      await newDoc.save();
      return res.status(200).json({ message: 'Succesfull' });
    } catch (e) {
      res.status(400).json({ message: 'Registration error' });
    }
  }
  // Создание записи к врачу и отправка уведомления(оповещения) за день и за 2 часа до указанной даты приема к врачу. Так же проверка на верную дату и незанятый слот.
  async doctorsAppointment(req, res) {
    try {
      const { user_id, doctor_id, slot } = req.body;
      const doctor = await Doctor.findOne({
        slots: { $elemMatch: { date_time: slot } },
      });

      if (!doctor) {
        return res.status(200).json({ message: 'Date is not found' });
      }
      const notAviableAppntm = await Appointment.findOne({ slot });
      if (notAviableAppntm) {
        return res.status(200).json({ message: 'Appointment not aviable' });
      }
      const appointmentTime = new Date(slot);
      const currentDate = new Date();
      const oneDayBefore = new Date(
        appointmentTime.getTime() - 24 * 60 * 60 * 1000
      ).toLocaleString('en-US', { timeZone: 'UTC' });
      const twoHoursBefore = new Date(
        appointmentTime.getTime() - 2 * 60 * 60 * 1000
      ).toLocaleString('en-US', { timeZone: 'UTC' });

      const oneDay = schedule.scheduleJob(oneDayBefore, function () {
        const oneDayBeforeMessage = `${currentDate} | Привет! Напоминаем, что вы записаны к ${doctor.spec} завтра ${slot}!`;
        logger.info(oneDayBeforeMessage);
        console.log(oneDayBeforeMessage);
      });

      const twoHours = schedule.scheduleJob(twoHoursBefore, function () {
        const twoHoursBeforeMessage = `${currentDate} | Привет! Напоминаем, что вы записаны к ${doctor.spec} через 2 часа ${slot}!`;
        logger.info(twoHoursBeforeMessage);
        console.log(twoHoursBeforeMessage);
      });
      const appointment = new Appointment({
        user_id,
        doctor_id,
        slot,
      });
      await appointment.save();
      res.status(200).json({ message: 'Appointment created' });
    } catch (e) {
      res.status(400).json({ message: 'Appointment error' });
    }
  }
}

export default new PostController();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5500;

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Создание схемы и модели для пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Парсинг JSON-тела запросов
app.use(bodyParser.json());
app.use(cors());

// Обработка POST-запроса на регистрацию
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received data:', username, password); // Добавьте это для отладки

  try {
    // Проверка, есть ли уже пользователь с таким именем
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).send('Пользователь с таким именем уже существует!');
    }

    // Сохранение нового пользователя
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('Пользователь зарегистрирован:', username);

    // Отправляем ответ клиенту
    res.status(200).send('Регистрация успешно выполнена!');
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка регистрации');
  }
});

// Обработка POST-запроса на вход
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received data:', username, password); // Добавьте это для отладки

  try {
    // Поиск пользователя в базе данных
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Неверное имя пользователя или пароль');
    }

    console.log('Пользователь вошел:', username);

    // Отправляем ответ клиенту
    res.status(200).send('Вход успешно выполнен!');
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    res.status(500).send('Ошибка входа');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

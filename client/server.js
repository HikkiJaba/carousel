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

// Схема и модель пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Схема и модель костюмов
const costumeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true }
});

const Costume = mongoose.model('Costume', costumeSchema);

app.use(bodyParser.json());
app.use(cors());

// Маршруты для пользователей
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).send('Пользователь с таким именем уже существует!');
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(200).send('Регистрация успешно выполнена!');
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).send('Ошибка регистрации');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send('Неверное имя пользователя или пароль');
    }

    res.status(200).send('Вход успешно выполнен!');
  } catch (error) {
    console.error('Ошибка при входе пользователя:', error);
    res.status(500).send('Ошибка входа');
  }
});

// Маршруты для костюмов
app.get('/costumes', async (req, res) => {
  try {
    const costumes = await Costume.find();
    res.json(costumes);
  } catch (error) {
    console.error('Error fetching costumes:', error);
    res.status(500).send('Ошибка при получении списка костюмов');
  }
});

app.post('/costumes', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  try {
    const costumeExists = await Costume.findOne({ name });
    if (costumeExists) {
      return res.status(400).send('Костюм с таким именем уже существует!');
    }

    const newCostume = new Costume({ name, price, description, imageUrl });
    await newCostume.save();
    res.status(201).json(newCostume);
  } catch (error) {
    console.error('Error adding costume:', error);
    res.status(500).send('Ошибка при добавлении костюма');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

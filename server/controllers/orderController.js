const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Функция для расчета общей стоимости заказа
const calculateTotalPrice = (product, options) => {
  let totalPrice = product.basePrice;

  if (options.mirrors) {
    totalPrice += 1000; // примерная стоимость зеркал
  }

  if (options.leds) {
    totalPrice += 500; // примерная стоимость диодов
  }

  if (options.color && options.color !== 'золото+красный') {
    totalPrice += 100; // дополнительная стоимость за нестандартный цвет
  }

  if (options.kinetics) {
    totalPrice += 1000; // примерная стоимость кинетики
  }

  return totalPrice;
};

// Функция для отправки email-уведомлений
const sendOrderEmail = (order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'manager-email@example.com',
    subject: `New Order: ${order._id}`,
    text: `Order Details: \n${JSON.stringify(order, null, 2)}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

exports.createOrder = async (req, res) => {
  const { user, product, options, address, contactNumber, comments } = req.body;

  try {
    const productDetails = await Product.findById(product);

    if (!productDetails) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const totalPrice = calculateTotalPrice(productDetails, options);

    const newOrder = new Order({
      user,
      product,
      options,
      totalPrice,
      address,
      contactNumber,
      comments,
    });

    await newOrder.save();
    sendOrderEmail(newOrder);

    res.json(newOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('product');
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const express = require('express');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');

const router = express.Router();

// Создать новый продукт.
router.post(
  '/',
  [
    authMiddleware,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('basePrice', 'Base price is required').isNumeric(),
      check('category', 'Category is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await productController.createProduct(req, res);
  }
);

// получить все продукты.
router.get('/', async (req, res) => {
  await productController.getProducts(req, res);
});


// Получить продукт по ID.
router.get('/:id', async (req, res) => {
  await productController.getProductById(req, res);
});


// Обновить по ID.
router.put(
  '/:id',
  [
    authMiddleware,
    [
      check('name', 'Name is required').optional().not().isEmpty(),
      check('basePrice', 'Base price is required').optional().isNumeric(),
      check('category', 'Category is required').optional().not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await productController.updateProduct(req, res);
  }
);

// Удалить продукт по ID.
router.delete('/:id', authMiddleware, async (req, res) => {
  await productController.deleteProduct(req, res);
});

module.exports = router;

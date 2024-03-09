const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const sessionMiddleware = require('../middleware/sessionMiddleware');

// Middleware để kiểm tra session
router.use(sessionMiddleware);

router.get('/create', categoryController.getCreateCategoryForm);
router.post('/create', categoryController.createCategory);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/update/:id', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;

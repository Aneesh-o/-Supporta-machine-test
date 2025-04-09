const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const verifyToken = require('../Middleware/jwtMiddleware');
const multerMiddleWare = require('../Middleware/multerMiddleWare')
const brandController = require('../Controller/brandController');
const brandMulterMiddleWare = require('../Middleware/brandMulterMiddleware')
const productController = require('../Controller/productController');
const productMulterMiddleWare = require('../Middleware/productMulterMiddleware');




// Public routes
router.post('/register', multerMiddleWare.single('profilePhoto'), userController.registerController);
router.post('/login', userController.loginController);
router.post('/refresh-token', userController.refreshTokenController);

// Protected routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile-update', verifyToken, multerMiddleWare.single('profilePhoto'), userController.updateProfile);


// Block another user
router.post('/block/:id', verifyToken, userController.blockUser);
router.post('/unblock/:id', verifyToken, userController.unblockUser);
router.get('/blocked-users', verifyToken, userController.getBlockedUsers);



// Add a new brand
router.post('/add', brandMulterMiddleWare.single('brandLogo'), brandController.addBrand);
router.get('/fetch-allProducts', brandController.getAllBrands);



// Add product
router.post('/add-product', verifyToken, productMulterMiddleWare.single('productImage'), productController.addProduct);
router.get('/get-allProducts',verifyToken, productController.getAllProducts);
router.put('/update-product/:id', verifyToken, productMulterMiddleWare.single('productImage'), productController.updateProduct);
router.delete('/delete-product/:id', verifyToken, productController.deleteProduct);



module.exports = router;
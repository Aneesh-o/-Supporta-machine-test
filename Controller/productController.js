const Product = require('../Model/productModel');
const Brand = require('../Model/brandModel');
const User = require('../Model/userModel');

// Add a product
exports.addProduct = async (req, res) => {
    console.log("addProduct");
    const { productName, description, price, category, brand, productImage } = req.body;
    const uploadedProductImage = req.file ? req.file.filename : productImage;
    const addedBy = req.userId;
    try {
        // Find brand by name (string), since brand is being sent as a name
        const existingBrand = await Brand.findOne({ brandName: brand });

        if (!existingBrand) {
            return res.status(400).json({ message: 'Brand does not exist' });
        }

        // Clean up category value and check if it exists in the brand
        const categoryExists = existingBrand.categories.some(cat =>
            cat.replace(/,\s*$/, '') === category
        );

        if (!categoryExists) {
            return res.status(400).json({ message: 'Category not found in brand categories' });
        }

        const newProduct = new Product({
            productName,
            description,
            price,
            category,
            brand: existingBrand._id, // Use ObjectId here
            productImage: uploadedProductImage,
            addedBy
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// API: Get all products with sorting, filtering, and blocking logic
exports.getAllProducts = async (req, res) => {
    try {
        const userId = req.userId;
        // Get filters and sorting from query params (GET request)
        const { sortBy, sortOrder, brand, category } = req.query;
        // Find users who have blocked the current user
        const usersWhoBlockedMe = await User.find({ blockedUsers: userId }).select('_id');
        const blockedUserIds = usersWhoBlockedMe.map(user => user._id);
        // Filtering conditions
        const filter = {
            addedBy: { $nin: blockedUserIds }
        };
        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        // Sorting options
        const sortOptions = {};
        const validSortFields = ['price', 'productName'];
        if (sortBy && validSortFields.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        const products = await Product.find(filter)
            .sort(sortOptions)
            .populate('brand', 'brandName')
            .populate('addedBy', 'username email');

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message });
    }
};


// Update a product (only by creator)
exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.addedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this product' });
        }

        // Allow updating specific fields
        const updatedData = {
            productName: req.body.productName || product.productName,
            description: req.body.description || product.description,
            price: req.body.price || product.price,
            category: req.body.category || product.category,
            productImage: req.file ? req.file.filename : product.productImage
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        res.status(200).json({ message: 'Product updated', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product (only by creator)
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.userId;

    try {
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.addedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this product' });
        }

        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

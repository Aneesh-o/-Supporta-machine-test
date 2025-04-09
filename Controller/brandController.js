const Brand = require('../Model/brandModel');

// Add a new brand
exports.addBrand = async (req, res) => {
    console.log("Inside addBrand");
    const { brandName, brandLogo, categories } = req.body;
    try {
        // Check if brand already exists
        const existingBrand = await Brand.findOne({ brandName });
        if (existingBrand) {
            return res.status(409).json({ message: 'Brand already exists' });
        }
        const uploadBrandLogo = req.file ? req.file.filename : brandLogo

        const newBrand = new Brand({
            brandName,
            brandLogo: uploadBrandLogo || '',
            categories: categories || []
        });

        await newBrand.save();
        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all brands with their categories
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find({}, 'brandName brandLogo categories'); // Only include needed fields
        res.status(200).json({
            message: "All brands with their categories fetched successfully",
            brands
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error: error.message });
    }
};

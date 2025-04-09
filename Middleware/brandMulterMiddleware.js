const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './Uploads')
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})

const multerMiddleWare = multer({
    storage
})

module.exports = multerMiddleWare
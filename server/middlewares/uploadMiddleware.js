const multer = require('multer');

const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: Number(process.env.MAX_IMAGE_SIZE_BYTES || 5 * 1024 * 1024),
    },
    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            callback(new Error('Only JPEG, PNG, or WEBP images are allowed'));
            return;
        }

        callback(null, true);
    },
});

const uploadSingleFaceImage = (req, res, next) => {
    upload.single('image')(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Image file is too large' });
            }

            return res.status(400).json({ message: error.message || 'Invalid image upload request' });
        }

        return res.status(400).json({ message: error.message || 'Invalid image upload request' });
    });
};

module.exports = {
    uploadSingleFaceImage,
};

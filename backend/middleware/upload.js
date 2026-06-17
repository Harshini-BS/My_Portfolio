// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const createStorage = (folder) => {
//   const uploadPath = path.join(__dirname, '../uploads', folder);
//   if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
//   return multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadPath),
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
//   });
// };

// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) cb(null, true);
//   else cb(new Error('Only image files are allowed'), false);
// };

// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') cb(null, true);
//   else cb(new Error('Only PDF files are allowed'), false);
// };

// const uploadImage = multer({ storage: createStorage('images'), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
// const uploadResume = multer({ storage: createStorage('resumes'), fileFilter: pdfFilter, limits: { fileSize: 10 * 1024 * 1024 } });
// const uploadProfileImage = multer({ storage: createStorage('profile'), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// module.exports = { uploadImage, uploadResume, uploadProfileImage };


const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage on Cloudinary
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, crop: 'limit' }],
  },
});

// Profile image storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/profile',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
  },
});

// // Resume storage (PDF)
// const resumeStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'portfolio/resumes',
//     allowed_formats: ['pdf'],
//     resource_type: 'raw',
//   },
// });

// Resume storage (PDF)
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    flags: 'attachment:false',
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { uploadImage, uploadResume, uploadProfileImage, cloudinary };
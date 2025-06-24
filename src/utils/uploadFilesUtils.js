const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getMulterStorage = (baseDir = '') => {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      let targetDir = 'others';
      if (file.fieldname === 'photo') targetDir = 'photo';
      if (file.fieldname === 'resumes') targetDir = 'pdf';

      const dir = path.join(
        __dirname,
        `../../public/uploads/${targetDir}`,
        baseDir,
        year.toString(),
        month,
        day
      );

      createDirectory(dir);
      callback(null, dir);
    },
    filename: (req, file, callback) => {
      const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extFile = path.extname(file.originalname);
      callback(null, `${file.fieldname}-${uniq}${extFile}`);
    },
  });
};

const fileFilter = () => {
  return (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = {
      photo: ['.jpg', '.jpeg', '.png'],
      resumes: ['.pdf'],
    };

    const fieldAllowed = allowed[file.fieldname] || [];

    if (fieldAllowed.includes(ext)) {
      callback(null, true);
    } else {
      callback(
        new Error(`File dengan ekstensi ${ext} tidak diizinkan.`),
        false
      );
    }
  };
};

const upload = () =>
  multer({
    storage: getMulterStorage(),
    fileFilter: fileFilter(),
  });

module.exports = upload;

/* eslint-disable prettier/prettier */
const multer = require('multer');
import { Request } from 'express';
import { join } from 'path';

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


// Configuration de multer avec un filtre pour n'accepter que les fichiers image
const storage = multer.diskStorage({
  destination: (req: Request, callBack) => {
    const uploadPath = join(__dirname, '..', '..', 'public', 'avatar');
    callBack(null, uploadPath);
  },

  filename: (req: { auth: { userPseudo: string; }; }, file: {
      mimetype: any; originalname: string; 
}, callBack: (arg0: null, arg1: string) => void) => {
      const user = req.auth.userPseudo.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
    callBack(null, user + '_avatar' + extension);
  },
});

// Fonction de filtre pour accepter uniquement les fichiers images
const fileFilter = (req: Request, file: { mimetype: string; }, cb: (arg0: Error, arg1: boolean) => void) => {
    
    const allowedImageTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true); // Accepter le fichier
    } else {
      cb(new Error('Seuls les fichiers image (JPEG,JPG, PNG, GIF)  sont autorisés'), false); // Rejeter le fichier
    }
  };

const uploadAvatar = multer({ storage: storage, fileFilter: fileFilter }).single('avatar');

export default uploadAvatar;

/* eslint-disable prettier/prettier */
import { Request} from 'express';
import { join } from 'path';
const multer = require('multer');



const MIME_TYPES = {
    'application/pdf': 'pdf'
  };

// Configuration de multer avec un filtre pour n'accepter que les fichiers PDF
const storage = multer.diskStorage({
    destination: (req: Request, cb) => {
         // on indique ou on va enregistrer les fichiers
    const uploadPath = join(__dirname, '..',"..", 'public', 'books');
    cb(null, uploadPath);
    },

    // Spécifie le nom du fichier
  filename: (req:Request, file: { originalname: string; mimetype: string | number; }, cb: (arg0: null, arg1: string) => void) => {
    const nom = file.originalname.split(' ').join('_');
    const name = nom.split('.').join('_');
      const extension = MIME_TYPES[file.mimetype];
    cb(null, name + Date.now() + '.' + extension);
  },
});

// Fonction de filtre pour accepter uniquement les fichiers PDF
const fileFilter = (req:Request, file: { mimetype: string; }, cb: (arg0: Error, arg1: boolean) => void) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés'), false); // Rejeter le fichier
  }
};

// Appliquer le filtre avec multer
const uploadBook = multer({ storage: storage, fileFilter: fileFilter }).single("book");

export default uploadBook;

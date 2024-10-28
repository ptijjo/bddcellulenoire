/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Book } from '@interfaces/books.interface';
import { BookService } from '@services/books.service';
import { CATEGORY } from '@prisma/client';

export class BookController {
  public book = Container.get(BookService);
  

  public  getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllBookData:Book[] = await this.book.findAllbook();

      res.status(200).json({ data: findAllBookData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public  getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const BookId = String(req.params.id);
      const findOneUserData: Book = await this.book.findBookById(BookId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

 
  public addBook = async (req: any , res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: Book = req.body;
        userData.url = `${req.protocol}://${req.get('host')}/public/books/${req.file.filename}`.split(' ').join('');
        const category: CATEGORY = req.body.category;

      const addBookData: Book = await this.book.addBook(userData,category);

      res.status(201).json({ data: addBookData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = String(req.params.id);
      const bookData: Book = req.body;
      const updateBookData: Book = await this.book.updatebook(bookId, bookData);

      res.status(200).json({ data: updateBookData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };


  public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = String(req.params.id);
      const deleteBookData: Book = await this.book.deletebook(bookId);

      res.status(200).json({ data: deleteBookData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

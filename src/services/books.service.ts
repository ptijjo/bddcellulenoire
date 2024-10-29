/* eslint-disable prettier/prettier */
import { CATEGORY, PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { AddBookDto } from '@dtos/books.dto';
import { HttpException } from '@/exceptions/httpException';
import { Book } from '@interfaces/books.interface';

@Service()
export class BookService {
  public book = new PrismaClient().book;
  public category = new PrismaClient().category;

  public async findAllbook(): Promise<Book[]> {
    const allBook: Book[] = await this.book.findMany();
    return allBook;
  }

  public async findBookById(bookId: string): Promise<Book> {
    const findBook: Book = await this.book.findUnique({ where: { id: bookId } });
    if (!findBook) throw new HttpException(409, "book doesn't exist");

    return findBook;
  }

  public async addBook(bookData: AddBookDto, categoryName: string , url: string): Promise<Book> {
    const findCategory = await this.category.findUnique({
      where: {
        type: categoryName as CATEGORY,
      },
    });

    if (!findCategory) throw new HttpException(409, "category doesn't exist");

    console.log(findCategory)

    const newbook: Book = await this.book.create({
      data: {
        title:bookData.title,
        url: url,
        categoryId:findCategory.id
      },
    });

    return newbook;
    
  }

  public async updatebook(bookId: string, bookData: AddBookDto): Promise<Book> {
    const findBook: Book = await this.book.findUnique({ where: { id: bookId } });
    if (!findBook) throw new HttpException(409, "book doesn't exist");

    const updateBookData = await this.book.update({ where: { id: bookId }, data: { ...bookData } });
    return updateBookData;
  }

  public async deletebook(bookId: string): Promise<Book> {
    const findBook: Book = await this.book.findUnique({ where: { id: bookId } });
    if (!findBook) throw new HttpException(409, "book doesn't exist");

    const deleteBookData = await this.book.delete({ where: { id: bookId } });
    return deleteBookData;
  }
}

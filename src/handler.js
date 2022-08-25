const { isEmpty } = require('lodash');
const { nanoid } = require('nanoid');
const books = require('./books');

/**POST */
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const check = () => {
        if (pageCount === readPage) {
            return true;
        } else {
            return false;
        }
    };
    const finished = check();

    const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isEmpty(name)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

/**GET ALL */
const getAllBooksHandler = (request, h) => {
    const newBooks = [];
    books.forEach((item) => {
        const items = {
            id: item.id,
            name: item.name,
            publisher: item.publisher,
        };
        newBooks.push(items);
    });

    const response = h.response({
        status: 'success',
        data: {
            books: newBooks,
        },
    });
    response.code(200);
    return response;
};

/**GET BY ID*/
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

/**EDIT */
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (isEmpty(name)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    if (index >= 0) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

/**DELETE */
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index >= 0) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};

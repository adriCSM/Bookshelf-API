const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        title,
        year,
        writer,
        summary,
        publisher,
        pageCount,
    } = request.payload;

    const id = nanoid(20);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBooks = {
        id,
        createdAt,
        updatedAt,
        title,
        year,
        writer,
        summary,
        publisher,
        pageCount,

    };

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'Success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'Failed',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = () => ({
    status: 'Success',
    data: {
        books,
    },
});

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'Success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'Failed',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        title,
        year,
        writer,
        summary,
        publisher,
        pageCount,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index >= 0) {
        books[index] = {
            ...books[index],
            title,
            year,
            writer,
            summary,
            publisher,
            pageCount,
            updatedAt,
        };
        const response = h.response({
            status: 'Success',
            message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'Failed',
        message: 'Gagal memperbarui Buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
    if (index >= 0) {
        books.splice(index, 1);
        const response = h.response({
            status: 'Success',
            message: 'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'Failed',
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
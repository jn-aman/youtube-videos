"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagingData = exports.getPagination = void 0;
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
exports.getPagination = getPagination;
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: videos } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, videos, totalPages, currentPage };
};
exports.getPagingData = getPagingData;
//# sourceMappingURL=videoControllerHelper.js.map
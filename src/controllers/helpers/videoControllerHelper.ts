export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: videos } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, videos, totalPages, currentPage };
};

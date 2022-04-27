const advancedResult = (model, populate) => async (request, response, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...request.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((params) => delete reqQuery[params]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (request.query.select) {
    const fields = request.query.select.split(",").join(" ");
    query.select(fields);
  }

  // Sort
  if (request.query.sort) {
    const sortBy = request.query.sort.split(",").join(" ");
    query.sort(sortBy);
  } else {
    query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  response.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResult;

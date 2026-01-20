import Tour from "../models/Tour.js";


export const aliasTopTours = (req, res, next) => {


  req.query.limit = "5";
  req.query.sort = "-price";

  // req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();

};
export const getTours = async (req, res, next) => {
  try {
    // console.log(req.query);
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);
    // console.log(queryObj);

    // 2) Advanced Filtering (gte, gt, lte, lt)
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const parsedQuery = JSON.parse(queryString);



    const input = parsedQuery;
    const outputQuery = {};

    for (const key in input) {
      if (key.includes('[')) {
        // Split "price[$lte]" into ["price", "$lte"]
        const parts = key.split(/[\[\]]/).filter(Boolean);
        const value = input[key];

        // Build the nested structure
        outputQuery[parts[0]] = { [parts[1]]: value };
      } else {
        outputQuery[key] = input[key];
      }
    }


    // 3) Build query (don't execute yet)
    let query = Tour.find(outputQuery);

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    // Pagination
    const totalTours = await Tour.countDocuments() || 100;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const totalPages = Math.ceil(totalTours / limit);
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (page > totalPages) {
      return res
        .status(404)
        .json({ message: "Page not found", error: "Page not found", success: false });
    }


    // 4) Execute query
    const tours = await query;

    // const tours = await Tour.find({
    //   price: { $gte: 1500 }
    // })



    res.status(200).json({
      message: "Successfully fetched tours",

      totalPages: totalPages,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      data: tours
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching tours", error: error.message });
  }
};
export const getTour = async (req, res, next) => {
  try {

    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ message: "Tour not found", error: "Tour not found" });
    }
    res.status(200).json({ message: "Hello World", data: tour });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error fetching tour", error: error.message });
  }
};
export const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    if (!newTour) {
      return res
        .status(404)
        .json({ message: "Error creating tour", error: "Error creating tour" });
    }
    res.status(200).json({ message: "Hello World", data: newTour });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error creating tour", error: error.message });
  }
};
export const updateTour = async (req, res, next) => {

  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ message: "Tour not found", error: "Tour not found" });
    }
    const updatedTour = await tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTour) {
      return res
        .status(404)
        .json({ message: "Error updating tour", error: "Error updating tour" });
    }
    res.status(200).json({ message: "Hello World", data: updatedTour });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error updating tour", error: error.message });
  }
};
export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ message: "Tour not found", error: "Tour not found" });
    }
    await tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tour deleted successfully", data: {}, success: true });
  } catch (error) {
    res
      .status(404)
      .json({ message: "Error deleting tour", error: error.message });
  }


};

export const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ success: false, message: "Name and price are required" });
  }
  next();
};



export const getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      { $group: { _id: "$difficulty", averagePrice: { $avg: "$price" }, averageRating: { $avg: "$ratingsAverage" }, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } ,numRatings: { $sum: "$ratingsQuantity" } } },
      { $sort: { averagePrice: -1 } },
      { $limit: 10 },
    ]);
    res.status(200).json({ message: "Successfully fetched tour stats", data: stats });
  } catch (error) {
    res.status(404).json({ message: "Error fetching tour stats", error: error.message });
  }
};

export const getMonthlyPlan = async (req, res, next) => {
  try {
    const year = parseInt(req.params.year);
    
    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid year", error: "Invalid year", success: false });
    }

    const plans = await Tour.aggregate([
      { $unwind: "$startDates" },
      { 
        $match: { 
          startDates: { 
            $gte: new Date(`${year}-01-01`), 
            $lte: new Date(`${year}-12-31`) 
          } 
        } 
      },
      { 
        $group: { 
          _id: { $month: "$startDates" }, 
          numToursStarts: { $sum: 1 }, 
          tours: { $push: "$name" } 
        } 
      },
      {
        $addFields: { month: "$_id.month" }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          numToursStarts: 1,
          tours: 1
        }
      },
      {
        $sort: { numToursStarts: -1 }
      }
    ]);
    
    res.status(200).json({ 
      success: true,
      message: "Successfully fetched monthly plans", 
      data: plans 
    });
  } catch (error) {
    // Pass error to error handler middleware instead of sending response directly
    next(error);
  }
};
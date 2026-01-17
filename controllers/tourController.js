import Tour from "../models/Tour.js";

export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({ message: "Hello World", data: tours });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tours", error: error.message });
  }
};
export const getTour = async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({ message: "Hello World", data: tour });
};
export const createTour = async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({ message: "Hello World", data: newTour });
};
export const updateTour = async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ message: "Hello World", data: updatedTour });
};
export const deleteTour = async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Hello World", data: {} });
};

export const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ success: false, message: "Name and price are required" });
  }
  next();
};

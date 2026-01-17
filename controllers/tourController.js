import Tour from "../models/Tour.js";

export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({ message: "Hello World", data: tours });
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
    res.status(200).json({ message: "Tour deleted successfully", data:{}, success: true });
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

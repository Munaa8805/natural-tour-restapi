import express from "express";

const router = express.Router();

router.param("id", async (req, res, next, value) => {
  console.log(`Tour ID is ${value}`);

  next();
});

import {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
} from "../controllers/tourController.js";

router.route("/").get(getTours).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;

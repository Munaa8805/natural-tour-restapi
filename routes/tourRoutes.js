import express from "express";

const router = express.Router();
import {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from "../controllers/tourController.js";

// router.param("id", async (req, res, next, value) => {
//   console.log(`Tour ID is ${value}`);

//   next();
// });

  router.route("/top-5-cheap").get(aliasTopTours, getTours);
  router.route("/tour-stats").get(getTourStats);
  router.route("/monthly-plan/:year").get(getMonthlyPlan);


router.route("/").get(getTours).post(checkBody, createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;

const express = require('express')
const {getAllTours, createTour,getTour,updateTour,deleteTour, checkID, checkBody, aliasTopTours, getTourStats, getMonthlyPlan, getToursWithin, getDistance, uploadTourImages, resizeTourImages} = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes')

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

//router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin', 'lead-guide', 'guide'),getMonthlyPlan)

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router.route('/distance/:latlng/unit/:unit').get(getDistance)

router.route('/').get( getAllTours)
                 .post(authController.protect,authController.restrictTo('admin, lead-guide'),createTour);
                          

router.route('/:id').get(getTour)
                    .patch(authController.protect,authController.restrictTo('admin', 'lead-guide'),updateTour)
                    .delete(authController.protect,authController.restrictTo('admin', 'lead-guide'),uploadTourImages, resizeTourImages,deleteTour);
  


                      
module.exports = router;

const router = require("express").Router();
const bucketController = require("../controllers/BucketController");
const ballController = require("../controllers/BallController");

const {bucketValidate,ballValidate} = require("../validator/Common");

// Bucket API
router.get("/bucket/list",bucketController.getBucketList);
router.post("/bucket/create",bucketValidate,bucketController.createBucket);
router.post("/bucket/update",bucketValidate,bucketController.editBucket);
router.get("/bucket/view",bucketController.getSingleBucket);
router.delete("/bucket/delete/:slug",bucketController.deleteBucket);
router.post("/bucket/add-balls",bucketController.AddBallInBucket);

// Ball API
router.get("/ball/all",ballController.getBalls);
router.get("/ball/list",ballController.getBallList);
router.post("/ball/create",ballValidate,ballController.createBall);
router.post("/ball/update",ballValidate,ballController.editBall);
router.get("/ball/view",ballController.getSingleBall);
router.delete("/ball/delete/:slug",ballController.deleteBall);

module.exports = router;
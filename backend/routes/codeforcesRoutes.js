const express = require('express');
const router = express.Router();
const codeforcesController = require('../controllers/codeforcesController');

router.get('/sync/:id', codeforcesController.syncDataForStudent);






const cfController = require('../controllers/codeforcesController');

router.get('/contests/:studentId', cfController.getContestHistory);
router.get('/problems/:studentId', cfController.getProblemSolvingStats);
router.get('/heatmap/:studentId', cfController.getHeatmapData);

module.exports = router;


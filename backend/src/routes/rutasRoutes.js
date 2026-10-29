const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');
const { handleImageUpload } = require('../middleware/uploadMiddleware');

router.get('/', rutasController.getAllRutas);
router.get('/:id', rutasController.getRutaById);
router.post('/', handleImageUpload, rutasController.createRuta);
router.put('/:id', handleImageUpload, rutasController.updateRuta);
router.delete('/:id', rutasController.deleteRuta);

module.exports = router;

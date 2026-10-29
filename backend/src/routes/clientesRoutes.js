const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/', clientesController.getAllClientes);
router.post('/', clientesController.createCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;

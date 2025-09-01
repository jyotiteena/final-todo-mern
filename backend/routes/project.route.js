const router = require('express').Router()
const {store, index, getProjectById, update, trash} = require('../controllers/project.controller')
router.post('/', store);
router.get('/', index);
router.get('/:id', getProjectById);
router.put('/:id', update);
router.delete('/:id', trash);

module.exports = router;
const router = require('express').Router()
const {
  store,
  index,
  getTodoById,
  update,
  trash,
  updateTodoStatus
} = require('../controllers/todo.controller');


router.post('/', store);
router.get('/', index);
router.get('/:id', getTodoById);
router.put('/:id', update);
router.delete('/:id', trash);
router.patch('/:id/status', updateTodoStatus);

module.exports = router;
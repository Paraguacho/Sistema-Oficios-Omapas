const expres = require('express');
const router = express.Router();

const {protect} = require('../middleware/authMiddleware');
const {
    getMyNotifications,
    markAsRead,
    markAllAsRead
} = require('../controllers/notificationController');

router.use(protect);


router.get('/', getMyNotifications);
//Tiene que ir primero read all para que no marque el read como id 
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;

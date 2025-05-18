const express = require('express');

// load the controller
const controller = require('../controllers/feed');

const router = express.Router();

// /session => GET
router.get("/session", controller.getSession)

/**
 * this func checks if a session is underway.
 * it allows fetches to our api only if a session exists
 * @param req
 * @param res
 * @param next if authentication succeeds, proceed to router's func
 * @returns {*|null}
 */
const auth =(req,res,next) => {
    if (req.session.connected)
        return next()
    else
        return null
}
// /:id => GET
router.get('/:id', auth, controller.getComments)

// /comment => POST
router.post('/comment',auth, controller.postComment)

// /:commentId => DELETE
router.delete('/:commentId',auth, controller.deleteComment)

// / => POST
router.post('/', controller.postLogin)

module.exports = router;

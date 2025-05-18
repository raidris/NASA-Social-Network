const includes = require("../util/includes")

/**
 * this func handles the get-router of the comments
 * @param req includes the date of the post in params. used to retrieve its comments
 * @param res
 * @param next
 * @returns {Promise<Model[]>} the comments of a given post
 */
exports.getComments = (req, res, next) => {

    if (!req.params.id) {
        res.status(400).send(JSON.stringify("Error: Missing required parameters"))
    } else {
        return includes.db.Comment.findAll({where: {postId: `${req.params.id}`}})
            .then(comments => {
                res.status(200).json({comments, currUser: `${req.session.name}`})
            }).catch(err => {
                console.log(err)
            })
    }
}

/**
 * this func handles the post-router of the comments. It creates a comment if it's valid.
 * @param req includes the date of the post and the comment itself in body. used to build the comment object
 * @param res
 * @param next
 * @returns {Promise<*>} returns a response accordingly
 */
exports.postComment = async (req, res, next) => {
    try {
        if (!req.body.comment) {
            res.status(400).send(JSON.stringify("Comment field is empty"))
        } else {
            let u = includes.db.Comment.build(
                {postId: req.body.postId, author: req.session.name, str: req.body.comment})
            await u.save()
            res.status(200).json({})
        }
    } catch (err) {
        if (err instanceof includes.Sequelize.ValidationError)
            console.log(`validation error ${err}`)
        else
            console.log(`other error ${err}`)
        res.status(500).send(JSON.stringify("Internal server error occurred."))
    }
}

/**
 * this func handles the delete-router of the comments. It deletes a comment.
 * @param req includes the date of the post and the comment itself in body. used to build the comment object
 * @param res
 * @param next
 * @returns {Promise<*>} returns a response accordingly
 */
exports.deleteComment = async (req, res, next) => {

    let comment = await includes.db.Comment.findOne({where: {id: req.params.commentId}})
    if (comment) {
        comment.destroy({force: true})
        return res.status(200).json({comment})
    } else {
        console.log("comment not found")
        return res.status(404).send(JSON.stringify("Failed deleting comment"))
    }
}

/**
 * this func handles the post-router of the login page.
 * it checks the validity of the inputs that the user entered, according to the database.
 * if inputs are valid, a session will be started for the user
 * @param req includes the email address and password entered by user in body. used to verify the user
 * @param res
 * @param next
 */
exports.postLogin = (req, res, next) => {

    includes.db.User.findOne({where: {email: `${req.body.email}`}}).then(user => {
        if (user) {
            if (includes.bcrypt.compareSync(req.body.password, user.password)) {
                req.session.connected = true;
                req.session.user = user.email;
                req.session.name = user.firstName + ' ' + user.lastName
                console.log(req.session)
                includes.functions.renderPage(res, 'feed', 'Feed', '/feed',
                    `Welcome ${req.session.name}`)
            } else throw new Error("Incorrect password")
        } else
            throw new Error("Account doesn't exist")
    }).catch(err => {
        req.session.msg = `${err}`
        res.redirect('/');
    })
}

/**
 * this func handles the get-router of the session.
 * it checks if there is a user is logged in
 * @param req
 * @param res
 * @param next
 */
exports.getSession = (req, res, next) => {
    if (req.session.connected === true) res.status(200).json(req.session.connected)
    else res.status(403).send(JSON.stringify('Unauthorized request'))
}

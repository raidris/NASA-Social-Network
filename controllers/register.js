const includes = require("../util/includes");

/**
 * this func handles the get-router of the first stage of the registering process.
 * clients can access this page only when not logged in.
 * @param req
 * @param res
 * @param next
 */
exports.getRegisterDetails = (req, res, next) => {
    if (!req.session.connected) {
        let data = includes.functions.getCookie(req, res)
        if (data) {
            let dataList = data.split(',')
            includes.functions.renderPage(res, 'add-details', 'Add details', '/register/add-details', '', dataList)
        } else
            includes.functions.renderPage(res, 'add-details', 'Add details', '/register/add-details', '')
    }
    else res.redirect('/')
}

/**
 * this func handles the post-router of the first stage of the registering process.
 * it creates a cookie where all the details entered by the client are saved for 30 seconds
 * the user needs to finish the process within this time frame
 * @param req includes the email address, first name and last name in body. used to create the cookie
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.postRegisterDetails = async (req, res, next) => {
    try {
        await includes.functions.validateEmailAddress(req.body.email)

        if (!includes.functions.getCookie(req, res)) {
            let cookies = new includes.Cookies(req, res, {keys: includes.keys})
            cookies.set('data',
                `${req.body.email},${req.body.firstName},${req.body.lastName}`,
                {signed: true, maxAge: 30 * 1000})
        }
        includes.functions.renderPage(res, 'add-password', 'Add Password', '/register/add-password')

    } catch (err) {
        includes.functions.renderPage(res, 'add-details', 'Add details', '/register/add-details', err)
    }
}

/**
 * this func handles the post-router of the second stage of the registering process.
 * clients can access this page only when not logged in.
 * @param req
 * @param res
 * @param next
 */
exports.getRegisterPassword = (req, res, next) => {
    if (!req.session.connected) {
        includes.functions.renderPage(res, 'add-password', 'Add password', '/register/add-password')
    } else res.redirect('/')
}

/**
 * this func handles the post-router of the second stage of the registering process.
 * it severs the session and redirects to login page.
 * @param req includes the password and its confirmation in body. used to build the user object
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.postRegisterPassword = async (req, res, next) => {
    try {
        includes.functions.validatePassword(req.body.password, req.body.confirmPassword)

        let cookies = new includes.Cookies(req, res, {keys: includes.keys});
        let data = cookies.get('data', {signed: true})

        let dataList = includes.functions.processData(data)
        cookies.set('data', '', {signed: true})

        await includes.functions.validateEmailAddress(dataList[0])

        if (data) {

            let hash = await includes.bcrypt.hash(req.body.password, includes.saltRounds)
            let u = includes.db.User.build(
                {email: dataList[0], firstName: dataList[1], lastName: dataList[2], password: hash}
            )
            await u.save()
            req.session.msg = "Registered Successfully"
            res.redirect('/')

        } else {
            req.session.msg = "Process expired. You need to start again. Please finish form in 30 seconds"
            res.redirect('/')

        }
    } catch (err) {
        if (err instanceof includes.Sequelize.ValidationError)
            console.log(`validation error ${err}`);
        else
            console.log(`other error ${err}`);

        includes.functions.renderPage(res, 'add-password', 'Add Password',
            '/register/add-password', err)
    }
}
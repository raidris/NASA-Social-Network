const includes = require("../util/includes")

/**
 * this func handles the get-router of the login page.
 * if a session is underway, the user will be directed to the feed.
 * @param req
 * @param res
 * @param next
 */
exports.getLogin = (req, res, next) => {
    if (req.session.connected)
        includes.functions.renderPage(res, 'feed', 'Feed', '/feed',
            `Welcome ${req.session.name}`)
    else {
        includes.functions.renderPage(res, 'loginPage', 'login', '/', req.session.msg)
        delete req.session.msg
    }

}

/**
 * this func handles the post-router of the logout functionality.
 * it severs the session and redirects to login page.
 * @param req
 * @param res
 * @param next
 */
exports.postLogout = (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
}
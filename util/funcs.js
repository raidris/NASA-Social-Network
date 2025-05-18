/**
 * a module containing common funcs
 */

const Cookies = require("cookies");
const keys = ['beetroot juice']
const db = require('../models');

module.exports = {
    /**
     * this func renders any page
     * @param res is the response of a router that must render a page
     * @param pName is the page name that must be rendered (ejs)
     * @param pTitle is the page title
     * @param pPath is the page path
     * @param message is a message to be displayed onto the page
     * @param dataList is list containing data to be displayed onto the page
     * @returns the render function
     */
    renderPage(res, pName, pTitle, pPath, message = '', dataList = ['', '', '']) {
        return res.render(`${pName}`, {
            pageTitle: `${pTitle}`,
            path: `${pPath}`,
            message: message,
            emailAddress: `${dataList[0]}`,
            firstName: `${dataList[1]}`,
            lastName: `${dataList[2]}`,
        });
    },
    /**
     * this func returns the register cookie
     * @param req
     * @param res
     * @returns {*}
     */
    getCookie(req, res) {
        let cookies = new Cookies(req, res, {keys: keys})
        return cookies.get('data', {signed: true})
    },
    /**
     * this function processes the data coming from the
     * @param data is the string of the cookie
     * @returns {string[]} is the processed string
     */
    processData(data) {
        return data.split(',').map(elem => {
            return elem.trim().toLowerCase()
        })
    },
    /**
     * this func validates the passwords during the registration process
     * @param pw is the password
     * @param pwCon is the confirmation
     * @returns {boolean} true if it's valid. otherwise false.
     */
    validatePassword(pw, pwCon) {
        if (pw === pwCon)
            return true
        else
            throw new Error("Passwords didn't match. Try again.");
    },
    /**
     * this func validates the email address during login in process
     * @param email is the email address used to log in
     * @returns {Promise<void>}
     */
    async validateEmailAddress(email) {
        let exists = await db.User.findOne({where: {email: email}})
        if (exists)
            throw new Error("Email isn't available.")
    },
}
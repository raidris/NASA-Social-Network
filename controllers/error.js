/**
 * this func handles the status code 404 and displays appropriate message
 * @param req
 * @param res
 * @param next
 */
exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path : '' });
};
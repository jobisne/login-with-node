module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated) {
      return next();
    }
    req.flash('success_error', 'You have to log in to view this resources')
  }
}
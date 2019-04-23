module.exports = function(config) {
  config = config || {};

  return function(req, res, next) {
    if (!req.user) {
      res.redirect(config.failureCallback || '/login');
    }
    else {
      next();
    }
  };
};

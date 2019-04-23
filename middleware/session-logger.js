module.exports = function() {
  return function(req, res, next) {
    if (req.session) {
      let json = JSON.stringify(req.session, null, 2);
      console.log('[session-logger] Session:');
      console.log(json);
    }
    else {
      console.log('[session-logger] No session found.');
    }

    next();
  };
};

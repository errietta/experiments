const requireAuth = (req, res, next) => {
  console.log(req.cookies);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(422).json({
      error: 'Not logged in',
    });
  }
};

module.exports = requireAuth;

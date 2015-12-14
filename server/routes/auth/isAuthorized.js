module.exports = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user.id, "Logged in!");
    return next();
  } else {
    console.log("Not logged in");
    res.redirect('/auth/facebook/login');
  }
};

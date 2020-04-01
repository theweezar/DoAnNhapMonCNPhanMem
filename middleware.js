const middleware = {
  redirectLogin: (req,res,next) => {
    if (!req.session.logged){
      res.redirect("/");
    }
    else next();
  },
  redirectApp: (req,res,next) => {
    if (req.session.logged){
      res.redirect("/app");
    }
    else next();
  }
}

module.exports = middleware;
const middleware = {
  redirectLogin: (req,res,next) => {
    if (!req.session.logged){
      res.redirect("/");
    }
    else next();
  },
}

module.exports = middleware;
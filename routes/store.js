
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('home', { page_title: 'Welcome to Connected Dashboard' })
};

/*
 * GET home page.
 */

exports.index = function(req, res){
	//render from index.ejs
  res.render('index', { title: 'Home',
	  					name: "Welcome!",
	  					phrase: "Fuck dat bitch!" }); 
};
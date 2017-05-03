var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View (req, res);
	var locals = res.locals;

	//set locals
	//section = active class in navbar
	locals.section = 'projekt';

	//load projects
	view.query('projects', keystone.list('Project').model.find());

	view.render('projects');
};

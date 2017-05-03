var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View (req, res);
	var locals = res.locals;

	//set locals
	//section = active class in navbar
	locals.section = 'projekt';
	locals.filters = {
		project: req.params.project
	};
	locals.data = {
		projects: []
	};

	view.on('init', function (next) {
		var q = keystone.list('Project').model.findOne({
			slug: locals.filters.project
		});

		q.exec(function (err, result) {
			locals.data.project = result;
			next();
		});
	});

	view.render('project');
};

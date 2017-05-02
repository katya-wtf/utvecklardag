var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View (req, res);
	var locals = res.locals;

	locals.section = 'about';
	locals.filters =  {
		about: req.params.about
	};
	locals.data = {
		abouts: []
	};

	//load current post
	view.on('init', function (next) {
		var q = keystone.list('About').model.findOne({
			state: 'published',
			slug: locals.filters.about
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.about = result;
			next(err);
		});
	});

	//load posts
	view.on('init', function (next) {
		var q = keystone.list('About').model.find()
											.where('state', 'published')
											.populate('author');

		q.exec(function (err, results) {
			locals.data.abouts = results;
			next(err);
		});
	});

	view.render('about');
};


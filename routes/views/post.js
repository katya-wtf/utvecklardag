var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	//set locals
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};

	//load current post
	view.on('init', function (next) {
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');

		q.exec(function (err, result) {
			locals.data.post = result;
			next(err);
		});
	});

	//load other posts
	view.on('init', function (next) {
		var q = keystone.list('Post').model.find()
						.where('state', 'published')
						.sort('-publishedDate')
						.populate('author')
						.limit('4');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	//render view
	view.render('post');
};
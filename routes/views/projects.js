var keystone = require('keystone');
var async = require('async');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View (req, res);
	var locals = res.locals;

	locals.section = 'projekt';
	locals.filters = {
		category: req.params.category,
		user: req.params.user
	};
	locals.data = {
		projects: [],
		categories: [],
		users: []
	};

	//load users
	view.on('init', function (next) {
		keystone.list('User').model
							.find()
							.sort('name')
							.exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.users = results;

			//load counts for each user
			async.each(locals.data.users, function (user, next) {

				keystone.list('Project')
						.model
						.count()
						.where('projectOwner participants contactPerson')
						.in([user.id])
						.exec(function (err, count) {
							user.projectOwnerCount = count;
							next(err);
						});
			}, function (err) {
				next(err);
			});
		});
	});

	//load categories
	view.on('init', function (next) {
		keystone.list('ProjectCategory').model
										.find()
										.sort('name')
										.exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			//load counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Project')
						.model
						.count()
						.where('categories')
						.in([category.id])
						.exec(function (err, count) {
							category.projectCount = count;
							next(err);
						});

			}, function (err) {
				next(err);
			});
		});
	});

	//load user filter
	view.on('init', function (next) {

		if (req.params.user) {
			keystone.list('User')
					.model
					.findOne({ key: locals.filters.user })
					.exec(function (err, result) {
						locals.data.user = result;
						next(err);
					});
		} else {
			next();
		}
	});

	//load current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('ProjectCategory')
					.model
					.findOne({ key: locals.filters.category })
					.exec(function (err, result) {
						locals.data.category = result;
						next(err);
					});
		} else {
			next();
		}
	});

	//loads the projects
	// view.query('projects', keystone.list('Project').model.find());

	view.on('init', function (next) {

		var q = keystone.list('Project').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published'
			},
		})
			.sort('-publishedDate')
			.populate('author categories projectOwner');

		if (locals.data.user) {
			q.where('projectOwner').in([locals.data.user]);
		}

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.projects = results;
			next(err);
		});
	});

	// CONTACT/ENQUIRY
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'Var vänlig försök igen',
		}, function (err) {
			if (err) {
				locals.data.validationErrors = err.errors;
			} else {
				req.flash('success', 'Ditt meddelande skickades :)');
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('projects');
};

var keystone = require('keystone');
var async = require('async');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View (req, res);
	var locals = res.locals;

	locals.section = 'projekt';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		projects: [],
		categories: []
	};

	//contact/enquiry
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
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
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
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.projects = results;
			next(err);
		});
	});

	view.render('projects');
};

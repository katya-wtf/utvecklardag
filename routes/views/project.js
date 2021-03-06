var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View (req, res);
	var locals = res.locals;

	//locals = active section in admin navbar
	locals.section = 'projekt';
	locals.filters = {
		project: req.params.project
	};
	locals.data = {
		projects: []
	};

	//load current project
	view.on('init', function (next) {

		var q = keystone.list('Project').model.findOne({
			state: 'published',
			slug: locals.filters.project
		}).populate('projectOwner participants contactPerson categories');

		q.exec(function (err, result) {
			locals.data.project = result;
			next(err);
		});
	});

	//load all projects
	view.on('init', function (next) {

		var q = keystone.list('Project')
						.model
						.find()
						.where('state', 'published')
						.sort('-publishedDate')
						.populate('projectOwner');

		q.exec(function (err, results) {
			locals.data.projects = results;
			next(err);
		});
	});

	//enquiry/contact
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
				req.flash('success', 'Your message was sent :)');
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('project');
};

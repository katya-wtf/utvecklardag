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

	//load current project
	view.on('init', function (next) {

		var q = keystone.list('Project').model.findOne({
			state: 'published',
			slug: locals.filters.project
		}).populate('author categories');

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
						.populate('author');

		q.exec(function (err, results) {
			locals.data.projects = results;
			next(err);
		});
	});

	view.render('project');
};

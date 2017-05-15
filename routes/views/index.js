var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'hem';
	// enquiry/contact
	locals.data = {};
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

	view.render('index');
};

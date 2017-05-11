var keystone = require('keystone');
var Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'question', label: 'Jag har en fråga' },
		{ value: 'devday', label: 'Jag vill anmäla mig till utvecklardagen!' },
		{ value: 'project-signup', label: 'Jag vill anmäla mig till ett projekt!' },
		{ value: 'client', label: 'Intresseanmälan om konsulttid' }
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Types.Date, default: Date.now }
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'enquiry-notification',
			transport: 'mailgun',
		}).send({
	 		to: 'karzan@botani.nu',
			from: {
				name: 'Utvecklardag',
				email: 'utvecklardag@oddhill.se'
			},
			subject: 'New enquiry for categories',
			enquiry: enquiry,
			brand: brand,
		}, callback);
	});
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name|25%, email|25%, enquiryType|25%, createdAt|25%';
Enquiry.register();

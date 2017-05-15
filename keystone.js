// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone')
var nodemailer = require('nodemailer')
var Email = require('keystone-email');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'utvecklardag',
	'brand': 'utvecklardag',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'emails': 'templates/emails',

	'auto update': true,
	'mongo': 'mongodb://localhost/utvecklardag',
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	enquiries: 'enquiries',
	projects: ['projects', 'project-categories'],
	users: 'users',
});

//try mailgun
// new Email('templates/emails/enquiry-notification.pug', {
// 	transport: 'mailgun'
// }).send({
// 		firstname: 'Max',
// 		name: 'Stoiber'
// 	}, {
// 		apiKey: 'key-9d94d5c7df86da729a94289c1a703a20',
// 	 	domain: 'sandbox65190a55bafb44f69308099024e25e22.mailgun.org',
// 	 	to: 'karzan@botani.nu',
// 	 	from: {
// 	 		name: 'Utvecklaradag',
// 	 		email: 'utvecklardag@oddhill.se',
// 	 	},
// 	 	subject: 'Your first KeystoneJS email',
// 	}, function (err, result) {
// 		if (err) {
// 	 		console.error('🤕 Mailgun test failed with error:\n', err);
// 	 	} else {
// 	 		console.log('📬 Successfully sent Mailgun test with result:\n', result);
// 	 	}
// });

// try nodemailer
// let transporter = nodemailer.createTransport({
// 	service: 'gmail',
// 	secure: false,
// 	port: 25,
// 	auth: {
// 		user: 'bot.karzan@gmail.com',
// 		pass: 'aftonblad3t'
// 	},
// 	tls: {
// 		rejectUnauthorized: false
// 	}
// });

// let HelperOptions = {
// 	form: '"Utvecklardag" <bot.karzan@gmail.com',
// 	to: 'karzan@botani.nu',
// 	subject: 'Hello',
// 	text: 'Wow, this tutorial sucks'
// };

// transporter.sendMail(HelperOptions, (error, info) => {
// 	if(error){
// 		return console.log(error);
// 	} else {
// 		console.log('The message was sent');
// 		console.log(info);
// 	}
// });

keystone.start();

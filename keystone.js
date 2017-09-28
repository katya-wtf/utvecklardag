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
	'cloudinary config': 'cloudinary://456632885733733:mKC1_6vExM8mJAS0R6dh5IU8WIg@keystone-get-started',
	'cookie secret': '=Hw1WfV6XlGW(w~K8=&5r%U2]EZ',

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

keystone.start();

var keystone = require('keystone');
var Types = keystone.Field.Types;

//About model
var About = new keystone.List('About', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

About.add({
	title: { type: String, required: true },
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	},
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: { type: Types.Html, wysiwyg: true, height: 400 }
});

About.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';

About.register();

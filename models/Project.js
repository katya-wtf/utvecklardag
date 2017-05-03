var keystone = require('keystone');
var Types = keystone.Field.Types;

var Project = new keystone.List('Project', {
	map: { name: 'title' },
	singular: 'Project',
	plural: 'Projects',
	autokey: { path: 'slug', from: 'title', unique: true }
});

Project.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true
	},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }},
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 200 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	}
});

Project.register();

var keystone = require('keystone');
var Types = keystone.Field.Types;

//About model
var About = new keystone.List('About', {
	autokey: { path: 'slug', from: 'title', unique: true }
});

About.add({
	title: { type: String, required: true },
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	},
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 200 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
});

About.schema.virtual('content full').get(function(){
	return.this.extended || this.content.brief;
});

About.defaultColumns = 'title, author|20%, categories|20%, publishedDate|20%';

About.register();

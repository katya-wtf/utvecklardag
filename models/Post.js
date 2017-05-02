var keystone = require('keystone');
var Types = keystone.Field.Types;

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
	//track - allows us to keep track
	//of when and who created
	//and last updated an item
	//track: true
});

Post.add({
	title: { type: String, required: true },
	//select so the value can be set
	//to one of the options/choices
	//default is set to draft
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
		index: true },
	//index = true - will tells keystone
	//that we are interested in
	//a database index to be
	//created for this field.
	author: {
		type: Types.Relationship,
		ref: 'User',
		index: true
	},
	publishedDate: {
		type: Types.Date,
		index: true,
		dependsOn: {
			state: 'published'
		}
	},
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 200 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

//virtual properties allows us
//to format the data in fields
//when retrieving them from a
//model or setting their value
Post.schema.virtual('content.full').get(function (){
	return this.content.extended || this.content.brief;
});

//defaultColumns - allows you to set
//the fields of your model that you
//want to display in admin list page.
Post.defaultColumns = 'title, state|20%, author|20%, categories|20%, publishedDate|20%';

Post.register();

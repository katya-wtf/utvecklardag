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
	projectOwner: { type: Types.Relationship, ref: 'User', index: true, many: true },
	state: {
		type: Types.Select,
		options: 'draft, published, archived',
		default: 'draft',
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
	// content: {
	// 	brief: { type: Types.Html, wysiwyg: true, height: 200 },
	// 	extended: { type: Types.Html, wysiwyg: true, height: 400 }
	// },
	goal: { type: Types.Html, wysiwyg: true, height: 200 },
	currentMaterial: { type: Types.Html, wysiwyg: true, height: 150 },
	individualROI: { type: Types.Html, wysiwyg: true, height: 150 },
	oddHillROI: { type: Types.Html, wysiwyg: true, height: 150 },
	technicalChoice: { type: Types.Html, wysiwyg: true, height: 150 },
	participants: { type: Types.Relationship, ref: 'User', index: true, many: true },
	neededResources: { type: Types.Html, wysiwyg: true, height: 150 },
	timePlan: { type: Types.Html, wysiwyg: true, height: 100 },
	finishedWhen: { type: Types.Html, wysiwyg: true, height: 100 },
	contactPerson: { type: Types.Relationship, ref: 'User', index: true, many: true },
	categories: { type: Types.Relationship, ref: 'ProjectCategory', many: true }
});

Project.defaultColumns = 'title, state|20%, projectOwner|20%, categories|20%, publishedDate|20%';

Project.register();

var keystone = require('keystone');

var ProjectCategory = new keystone.List('ProjectCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ProjectCategory.add({
	name: { type: String, required: true },
});

ProjectCategory.relationship({ ref: 'Project', path: 'projects', refPath: 'categories' });

ProjectCategory.register();

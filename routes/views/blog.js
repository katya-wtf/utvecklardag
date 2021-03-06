var keystone = require('keystone');
var async = require('async');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

    var view = new keystone.View (req, res);
    var locals = res.locals;

    locals.section = 'blogg';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        posts: [],
        categories: []
    };

    //load all categories
    view.on('init', function (next) {
        keystone.list('PostCategory').model
					                .find()
					                .sort('name')
					                .exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

			locals.data.categories = results;

            //load the counts for each cateogry
            async.each(locals.data.categories, function (category, next) {

                keystone.list('Post')
                		.model
                        .count()
                        .where('categories')
                        .in([category.id])
                        .exec(function (err, count) {
                            category.postCount = count;
                            next(err);
               			});

            }, function (err) {
                next(err);
            });
        });
    });

    //load the current category filter
    view.on('init', function (next) {

        if (req.params.category) {
            keystone.list('PostCategory')
            		.model
                    .findOne({ key: locals.filters.category })
                    .exec(function (err, result) {
                        locals.data.category = result;
                        next(err);
                    });
        } else {
            next();
        }
    });

    //load the posts
    view.on('init', function (next) {

        var q = keystone.list('Post').paginate({
            page: req.query.page || 1,
            perPage: 10,
            maxPages: 10,
            filters: {
                state: 'published'
            },
        })
            .sort('-publishedDate')
            .populate('author categories');

        if (locals.data.category) {
            q.where('categories').in([locals.data.category]);
        }

        q.exec(function (err, results) {
            locals.data.posts = results;
            next(err);
        });
    });

    //enquiry/contact
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

    view.render('blog');
};

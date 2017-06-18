'use strict';

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _firebaseAdmin = require('firebase-admin');

var fbAdmin = _interopRequireWildcard(_firebaseAdmin);

var _googleCloud = require('google-cloud');

var gcloud = _interopRequireWildcard(_googleCloud);

var _colors = require('colors');

var colors = _interopRequireWildcard(_colors);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function (_, colors, path, fs, fbAdmin, gcloud, acct, seed, mime) {

    var totalCoverPics = 24;
    var totalLogoPics = 24;
    var totalComicThumbnails = 7;
    var totalStoryPics = 60;

    var bucketName = 'testangular-44f78.appspot.com';

    var createPublicFileUrl = function createPublicFileUrl(bucketName, storageName) {
        return 'http://storage.googleapis.com/' + bucketName + '/' + encodeURIComponent(storageName);
    };

    var checkProcessComplete = function checkProcessComplete() {
        if (totalCoverPics == 0 && totalLogoPics == 0 && totalComicThumbnails == 0 && totalStoryPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Seed job completed, you are all set!!!'.green);
                console.log('---------------------------------------------------------');
            }, 500);
        }
    };

    var updateHeroCoverPic = function updateHeroCoverPic(fireDb, heroid, heroCoverPicUrl) {
        fireDb.ref().child('Heroes/' + heroid + '/coverPicUrl').set(heroCoverPicUrl);
        if (totalCoverPics > 0) totalCoverPics--;

        if (totalCoverPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Covers pics updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var updatePublisherCoverPic = function updatePublisherCoverPic(fireDb, publisherId, publisherCoverPicUrl) {
        fireDb.ref().child('Publishers/' + publisherId + '/coverPicUrl').set(publisherCoverPicUrl);
        if (totalCoverPics > 0) totalCoverPics--;

        if (totalCoverPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Covers pics updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var updateHeroLogo = function updateHeroLogo(fireDb, heroid, heroLogoUrl) {
        fireDb.ref().child('Heroes/' + heroid + '/logoUrl').set(heroLogoUrl);
        if (totalLogoPics > 0) totalLogoPics--;

        if (totalLogoPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Logo pics updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var updatePublisherLogo = function updatePublisherLogo(fireDb, publisherId, publisherLogoUrl) {
        fireDb.ref().child('Publishers/' + publisherId + '/logoUrl').set(publisherLogoUrl);

        if (totalLogoPics > 0) totalLogoPics--;

        if (totalLogoPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Logo pics updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var updateComicThumbnail = function updateComicThumbnail(fireDb, comicId, comicThumbnail) {
        fireDb.ref().child('Comics/' + comicId + '/thumbnailUrl').set(comicThumbnail);

        if (totalComicThumbnails > 0) totalComicThumbnails--;

        if (totalComicThumbnails == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Comic thumbnails updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var updateStoryPic = function updateStoryPic(fireDb, heroId, storyId, storyPicUrl) {
        fireDb.ref().child('Stories/' + heroId + '/' + storyId + '/imageUrl').set(storyPicUrl);

        if (totalStoryPics > 0) totalStoryPics--;

        if (totalStoryPics == 0) {
            setTimeout(function () {
                console.log('---------------------------------------------------------');
                console.log('Story pics updated succcessfully'.green);
                console.log('---------------------------------------------------------');

                checkProcessComplete();
            }, 200);
        }
    };

    var uploadCoverPics = function uploadCoverPics(fireDb, gstore, mime) {
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'CoverPics'), function (err, files) {

            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            var bucket = gstore.bucket(bucketName);

            _.each(_.filter(files, function (f) {
                return f.startsWith('Hero');
            }), function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'CoverPics', file);
                var storageName = 'CoverPics/' + file;
                var heroId = _.split(file, '.')[0];
                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded Cover pic for Hero ' + heroId).green);
                        updateHeroCoverPic(fireDb, heroId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });

            _.each(_.filter(files, function (f) {
                return f.startsWith('Publisher');
            }), function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'CoverPics', file);
                var storageName = 'CoverPics/' + file;
                var publisherId = _.split(file, '.')[0];
                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded Cover pic for Publisher ' + publisherId).green);
                        updatePublisherCoverPic(fireDb, publisherId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });
        });
    };

    var uploadLogos = function uploadLogos(fireDb, gstore, mime) {
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'Logos'), function (err, files) {

            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            var bucket = gstore.bucket(bucketName);

            _.each(_.filter(files, function (f) {
                return f.startsWith('Hero');
            }), function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'Logos', file);
                var storageName = 'Logos/' + file;
                var heroId = _.split(file, '.')[0];
                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded Logo for Hero ' + heroId).green);
                        updateHeroLogo(fireDb, heroId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });

            _.each(_.filter(files, function (f) {
                return f.startsWith('Publisher');
            }), function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'Logos', file);
                var storageName = 'Logos/' + file;
                var publisherId = _.split(file, '.')[0];

                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded Logo for Publisher ' + publisherId).green);
                        updatePublisherLogo(fireDb, publisherId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });
        });
    };

    var uploadComics = function uploadComics(fireDb, gstore, mime) {
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'ComicThumbnails'), function (err, files) {

            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            var bucket = gstore.bucket(bucketName);

            _.each(files, function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'ComicThumbnails', file);
                var storageName = 'ComicThumbnails/' + file;
                var comicId = _.split(file, '.')[0];

                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded thumbnail for Comic ' + comicId).green);
                        updateComicThumbnail(fireDb, comicId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });
        });
    };

    var uploadStories = function uploadStories(fireDb, gstore, mime) {
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'StoryPics'), function (err, files) {

            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            var bucket = gstore.bucket(bucketName);

            _.each(files, function (file) {
                var filePath = path.join(__dirname, '..', 'data', 'images', 'StoryPics', file);
                var storageName = 'StoryPics/' + file;
                var splits = _.split(file, '-Story-');
                var heroId = splits[0];
                var storyId = ('Story-' + splits[1]).split('.')[0];

                bucket.upload(filePath, {
                    destination: storageName,
                    public: true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300" }
                }, function (err) {
                    if (err) console.log(err.red);else {
                        console.log(('Uploaded thumbnail for Hero ' + heroId + ', Story ' + storyId).green);
                        updateStoryPic(fireDb, heroId, storyId, createPublicFileUrl(bucketName, storageName));
                    }
                });
            });
        });
    };

    console.log('Starting seed...'.blue);
    var fireApp = fbAdmin.initializeApp({
        credential: fbAdmin.credential.cert(acct),
        databaseURL: 'https://testangular-44f78.firebaseio.com/'
    });

    var gstore = gcloud.storage({
        projectId: acct.project_id,
        keyFilename: './hero.config.json'
    });

    var fireDb = fbAdmin.database();
    var ref = fireDb.ref();

    console.log('Uploading Seed Data...'.blue);
    ref.set(seed, function (err) {
        if (err) console.log(err.red);else {
            uploadCoverPics(fireDb, gstore, mime);
            uploadLogos(fireDb, gstore, mime);
            uploadComics(fireDb, gstore, mime);
            uploadStories(fireDb, gstore, mime);
        }
    });

    console.log('Database upload complete'.green);
})(_, colors, path, fs, fbAdmin, gcloud, require('./../hero.config.json'), require('./../data/herodb.seed.json'), require('mime'));
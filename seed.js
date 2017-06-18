import * as _ from 'lodash'
import * as fbAdmin from 'firebase-admin'
import * as gcloud from 'google-cloud'
import * as colors from 'colors'
import * as fs from 'fs'
import * as path from 'path'


((_, colors, path, fs, fbAdmin, gcloud, acct, seed, mime) => {

    let totalCoverPics = 24
    let totalLogoPics = 24
    let totalComicThumbnails = 7
    let totalStoryPics = 60

    let bucketName = 'testangular-44f78.appspot.com'

    let createPublicFileUrl = (bucketName, storageName) => `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`

    let checkProcessComplete = function () {
        if(totalCoverPics == 0 && totalLogoPics == 0 && totalComicThumbnails == 0 && totalStoryPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Seed job completed, you are all set!!!'.green)
                console.log('---------------------------------------------------------')
            }, 500)       
        }
    }

    let updateHeroCoverPic = (fireDb, heroid, heroCoverPicUrl) => {
        fireDb.ref().child(`Heroes/${heroid}/coverPicUrl`).set(heroCoverPicUrl)
        if(totalCoverPics > 0)
            totalCoverPics--

        if(totalCoverPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Covers pics updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        } 
    }

    let updatePublisherCoverPic = (fireDb, publisherId, publisherCoverPicUrl) => {
        fireDb.ref().child(`Publishers/${publisherId}/coverPicUrl`).set(publisherCoverPicUrl)
        if(totalCoverPics > 0)
            totalCoverPics--

        if(totalCoverPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Covers pics updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        }   
    }

    let updateHeroLogo = (fireDb, heroid, heroLogoUrl) => {
        fireDb.ref().child(`Heroes/${heroid}/logoUrl`).set(heroLogoUrl)
        if(totalLogoPics > 0)
            totalLogoPics--

        if(totalLogoPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Logo pics updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        }   
    }

    let updatePublisherLogo = (fireDb, publisherId, publisherLogoUrl) => {
        fireDb.ref().child(`Publishers/${publisherId}/logoUrl`).set(publisherLogoUrl)
        
        if(totalLogoPics > 0)
            totalLogoPics--

        if(totalLogoPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Logo pics updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        }  
    }

    let updateComicThumbnail = (fireDb, comicId, comicThumbnail) => {
        fireDb.ref().child(`Comics/${comicId}/thumbnailUrl`).set(comicThumbnail)
        
        if(totalComicThumbnails > 0)
            totalComicThumbnails--

        if(totalComicThumbnails == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Comic thumbnails updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        }  
    }

    let updateStoryPic = (fireDb, heroId, storyId, storyPicUrl) => {
        fireDb.ref().child(`Stories/${heroId}/${storyId}/imageUrl`).set(storyPicUrl)
        
        if(totalStoryPics > 0)
            totalStoryPics--

        if(totalStoryPics == 0)
        {
            setTimeout( () => {
                console.log('---------------------------------------------------------')
                console.log('Story pics updated succcessfully'.green)
                console.log('---------------------------------------------------------')

                checkProcessComplete()
            }, 200)
        }  
    }

    let uploadCoverPics = (fireDb, gstore, mime) => {        
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'CoverPics'), (err, files) => {
            
            if( err ) {
                console.error( "Could not list the directory.", err )
                process.exit( 1 )
            }

            let bucket = gstore.bucket(bucketName)

            _.each(_.filter(files, f => f.startsWith('Hero')), file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'CoverPics', file)
                let storageName = `CoverPics/${file}`
                let heroId = _.split(file, '.')[0]
                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded Cover pic for Hero ${heroId}`.green)
                        updateHeroCoverPic(fireDb, heroId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })

            _.each(_.filter(files, f => f.startsWith('Publisher')), file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'CoverPics', file)
                let storageName = `CoverPics/${file}`
                let publisherId = _.split(file, '.')[0]
                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded Cover pic for Publisher ${publisherId}`.green)
                        updatePublisherCoverPic(fireDb, publisherId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })
        })
    }

    let uploadLogos = (fireDb, gstore, mime) => {        
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'Logos'), (err, files) => {
            
            if( err ) {
                console.error( "Could not list the directory.", err )
                process.exit( 1 )
            }

            let bucket = gstore.bucket(bucketName)

            _.each(_.filter(files, f => f.startsWith('Hero')), file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'Logos', file)
                let storageName = `Logos/${file}`
                let heroId = _.split(file, '.')[0]
                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded Logo for Hero ${heroId}`.green)
                        updateHeroLogo(fireDb, heroId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })

            _.each(_.filter(files, f => f.startsWith('Publisher')), file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'Logos', file)
                let storageName = `Logos/${file}`
                let publisherId = _.split(file, '.')[0]

                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded Logo for Publisher ${publisherId}`.green)
                        updatePublisherLogo(fireDb, publisherId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })
        })
    }

    let uploadComics = (fireDb, gstore, mime) => {        
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'ComicThumbnails'), (err, files) => {
            
            if( err ) {
                console.error( "Could not list the directory.", err )
                process.exit( 1 )
            }

            let bucket = gstore.bucket(bucketName)

            _.each(files, file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'ComicThumbnails', file)
                let storageName = `ComicThumbnails/${file}`
                let comicId = _.split(file, '.')[0]

                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded thumbnail for Comic ${comicId}`.green)
                        updateComicThumbnail(fireDb, comicId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })
        })
    }

    let uploadStories = (fireDb, gstore, mime) => {        
        fs.readdir(path.join(__dirname, '..', 'data', 'images', 'StoryPics'), (err, files) => {
            
            if( err ) {
                console.error( "Could not list the directory.", err )
                process.exit( 1 )
            }

            let bucket = gstore.bucket(bucketName)

            _.each(files, file => {
                let filePath = path.join(__dirname, '..', 'data', 'images', 'StoryPics', file)
                let storageName = `StoryPics/${file}`
                let splits = _.split(file, '-Story-')
                let heroId = splits[0]
                let storyId = `Story-${splits[1]}`.split('.')[0]

                bucket.upload(filePath, {
                    destination: storageName,
                    public:true,
                    metadata: { contentType: mime.lookup(filePath), cacheControl: "public, max-age=300"}
                }, (err) => {
                    if(err)
                        console.log(err.red)
                    else {
                        console.log(`Uploaded thumbnail for Hero ${heroId}, Story ${storyId}`.green)
                        updateStoryPic(fireDb, heroId, storyId, createPublicFileUrl(bucketName, storageName))
                    }   
                })
            })
        })
    }

    console.log('Starting seed...'.blue)
    let fireApp = fbAdmin.initializeApp({
        credential: fbAdmin.credential.cert(acct),
        databaseURL: 'https://testangular-44f78.firebaseio.com/'
    })

    let gstore = gcloud.storage({
        projectId: acct.project_id,
        keyFilename: './hero.config.json'
    })

    let fireDb = fbAdmin.database()
    let ref = fireDb.ref()

    console.log('Uploading Seed Data...'.blue)
    ref.set(seed, err => {
        if(err)
            console.log(err.red)
        else {
            uploadCoverPics(fireDb, gstore, mime)
            uploadLogos(fireDb, gstore, mime)
            uploadComics(fireDb, gstore, mime)
            uploadStories(fireDb, gstore, mime)
        }
    })

    console.log('Database upload complete'.green)

})(_, colors, path, fs, fbAdmin, gcloud, require('./../hero.config.json'), require('./../data/herodb.seed.json'), require('mime'))
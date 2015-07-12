export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

declare var Promise;

import {initLogging, log, logError} from './util/logging'

export default
class StaticData {
    db:any;
    boom:any;
    joi:any;
    imageUtil:any;
    regex:any;
    imageSize:any;
    hoek:any;

    constructor() {
        this.register.attributes = {
            pkg: require('./../../package.json')
        };

        this.joi = require('joi');
        this.boom = require('boom');
        this.imageUtil = require('locator-image-utility').image;
        this.imageSize = require('locator-image-utility').size;
        this.regex = require('locator-image-utility').regex;
        this.hoek = require('hoek');
    }

    register:IRegister = (server, options, next) => {
        server.bind(this);

        server.dependency('ark-database', (server, next) => {
            this.db = server.plugins['ark-database'];
            next();
        });

        server.expose('uploadImage', this.uploadImage);

        this._register(server, options);
        initLogging(server);
        next();
    };

    uploadImage = (request, type) => {

        // extract needed data
        var bareRequest = this.imageUtil.stripHapiRequestObject(request);

        // create the image processor
        var imageProcessor = this.imageUtil.processor(bareRequest.options);
        if (imageProcessor.error) {
            return Promise.reject(this.boom.badRequest(imageProcessor.error))
        }

        var pictureData:any = {};
        pictureData.cropping = bareRequest.cropping;


        if (type === 'location') {

            var documentId = request.params.locationid;
            this.hoek.merge(pictureData, imageProcessor.createFileInformation(request.payload.locationTitle, 'locations', documentId));
            var array = [this.imageSize.mid.name, this.imageSize.mobile.name, this.imageSize.max.name, this.imageSize.small.name, this.imageSize.mobileThumb.name];
            return this._uploadImage(imageProcessor, pictureData, array, documentId);

        } else if (type === 'user') {

            var documentId = request.auth.credentials._id;
            this.hoek.merge(pictureData, imageProcessor.createFileInformation('profile', 'users', documentId));
            var array = [this.imageSize.user.name, this.imageSize.userThumb.name];
            return this._uploadImage(imageProcessor, pictureData, array, documentId);

        } else if (type === 'location-mobile') {

            var documentId = request.params.locationid;
            this.hoek.merge(pictureData, imageProcessor.createFileInformation(request.payload.locationTitle, 'locations', documentId));
            var array = [this.imageSize.mobile.name, this.imageSize.mid.name, this.imageSize.max.name, this.imageSize.small.name, this.imageSize.mobileThumb.name];
            return this._uploadImage(imageProcessor, pictureData, array, documentId);

        } else {
            return Promise.reject(this.boom.badRequest('Type must be location, location-mobile or user'))
        }
    };

    _uploadImage = (imageProcessor, imgdata, array, documentid) => {
        return new Promise((resolve, reject) => {

            var attachmentData = imgdata.attachmentData;
            var cropping = imgdata.cropping;
            var url = imgdata.url;
            var id = documentid;

            // create hashmap with streams
            var streams:any = {};
            array.forEach(sizeName => {
                attachmentData.name = sizeName;
                streams[sizeName] = {
                    stream: imageProcessor.createCroppedStream(cropping, this.imageSize.all[sizeName]),
                    attachmentData: this.hoek.clone(attachmentData)
                }
            });

            var size = array.shift();
            this.db.savePicture(id, streams[size].attachmentData, streams[size].stream)
                .then(() => {
                    return this.db.updateDocumentWithoutCheck(id, {picture: url});
                }).then((value:any) => {
                    value.imageLocation = url;
                    return resolve(value);
                }).catch(err => {
                    return reject(err)
                }).then(() => {
                    // upload all other images
                    return this._loopImageUpload(array, streams, id);
                }).then(() => {
                    log('all uploaded')
                }).catch(err => {
                    logError('unable to save picture, because of')
                    logError(err);
                    logError(err.message);
                });
        })

    };

    private _loopImageUpload = (imageArray, pictureHashMap, id) => {
        if (!imageArray.length) {
            return Promise.resolve();
        } else {
            // remove first element
            var currentSize = imageArray.shift();
            return this.db.savePicture(id, pictureHashMap[currentSize].attachmentData, pictureHashMap[currentSize].stream)
                .then(() => {
                    return this._loopImageUpload(imageArray, pictureHashMap, id);
                }).catch(err => Promise.reject(err))
        }
    };

    private _register(server, options) {


        // get all cities
        server.route({
            method: 'GET',
            path: '/data/cities',
            config: {
                auth: false,
                handler: (request, reply) => {
                    reply(this.db.getCitiesWithTrips());
                },
                description: 'Get only cities in trips',
                tags: ['api', 'staticdata']
            }
        });

        server.route({
            method: 'GET',
            path: '/data/location/defaultLocation',
            config: {
                auth: false,
                handler: (request, reply) => {
                    reply(this.db.getDefaultLocation());
                },
                description: 'Get THE default location (Strandbar Konstanz)',
                tags: ['api', 'staticdata']
            }
        });

        server.route({
            method: 'GET',
            path: '/data/location/tags',
            config: {
                auth: false,
                handler: (request, reply) => {
                    reply(this.boom.resourceGone());
                    //reply(this.db.getAllTagsFromLocations());
                },
                description: 'Get all tags used in locations',
                tags: ['api', 'staticdata', 'location', 'tags']
            }
        });

        // get all fixed cities
        server.route({
            method: 'GET',
            path: '/data/fixCities',
            config: {
                auth: false,
                handler: (request, reply) => {

                    var tuebingen = {
                        id: '8887cfb6c5c06cb28a693abfa9482704e56102b0',
                        place_id: 'ChIJgdDN7dT6mUcRjacz_s6uCKw',
                        title: 'Tübingen'
                    };

                    var karlsruhe = {
                        id: '96e29f500a912ff4d364d6386fbe450326eaabfd',
                        place_id: 'ChIJCXjgokgGl0cRf-63THNV_LY',
                        title: 'Karlsruhe'
                    };

                    var heidelberg = {
                        id: '7726b02bed0cda057da30946c5e1c6b6497e8249',
                        place_id: 'ChIJzdzMDgXBl0cR1zokRADq5u8',
                        title: 'Heidelberg'
                    };

                    var freiburg = {
                        id: '537f35d3af241ccc749a46f73626df1a27eba86e',
                        title: 'Freiburg',
                        place_id: 'ChIJZdYLViYbkUcRsFffpbdrHwQ'
                    };

                    var konstanz = {
                        id: '58433437e7710a957cd798b0774a79385389035b',
                        title: 'Konstanz',
                        place_id: 'ChIJWx8MOBv2mkcR0JnfpbdrHwQ'
                    };

                    reply([konstanz]);//, freiburg, karlsruhe, heidelberg, tuebingen]);
                },
                description: 'Get only Freiburg, Konstanz, Tuebingen, Karlsruhe and Heidelberg',
                tags: ['api', 'staticdata']
            }
        });

        return 'register';
    }
}



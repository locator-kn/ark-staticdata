export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class StaticData {
    db:any;
    boom:any;
    joi:any;

    constructor() {
        this.register.attributes = {
            pkg: require('./../../package.json')
        };

        this.joi = require('joi');
        this.boom = require('boom');
    }

    register:IRegister = (server, options, next) => {
        server.bind(this);

        server.dependency('ark-database', (server, next) => {
            this.db = server.plugins['ark-database'];
            next();
        });

        this._register(server, options);
        next();
    };

    private _register(server, options) {
        // get all moods
        server.route({
            method: 'GET',
            path: '/data/moods',
            config: {
                auth: false,
                handler: (request, reply) => {
                    this.db.getMoods((err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Get all moods',
                tags: ['api', 'staticdata']
            }
        });

        // get all cities
        server.route({
            method: 'GET',
            path: '/data/cities',
            config: {
                auth: false,
                handler: (request, reply) => {
                    this.db.getCitiesWithTrips((err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Get only cities in trips',
                tags: ['api', 'staticdata']
            }
        });


        // get all accommodations
        server.route({
            method: 'GET',
            path: '/data/accommodations/equipment',
            config: {
                auth: false,
                handler: (request, reply) => {
                    this.db.getAccommodations((err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Get all accommodations',
                tags: ['api', 'staticdata']
            }
        });


        // create new mood
        server.route({
            method: 'POST',
            path: '/data/moods',
            config: {
                handler: (request, reply) => {
                    this.db.createMood(request.payload, (err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Create new mood',
                tags: ['api', 'staticdata'],
                validate: {
                    payload: this.joi.object().keys({
                        title: this.joi.string().required(),
                        icon: this.joi.string(),
                        query_name: this.joi.string().required(),
                        image: this.joi.string(),
                        description: this.joi.string(),
                        excludes: this.joi.array(),
                        type: this.joi.string().required().valid('mood')
                    })
                        .required()
                        .description('Mood object')
                }
            }
        });

        // create new city
        server.route({
            method: 'POST',
            path: '/data/cities',
            config: {
                handler: (request, reply) => {
                    this.db.createCity(request.payload, (err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Create new city',
                tags: ['api', 'staticdata'],
                validate: {
                    payload: this.joi.object().keys({
                        name: this.joi.string().required(),
                        plz: this.joi.string(),
                        type: this.joi.string().required().valid('city')
                    })
                        .required()
                        .description('city')
                }
            }
        });

        // create new city
        server.route({
            method: 'POST',
            path: '/data/accommodations/equipment',
            config: {
                handler: (request, reply) => {
                    this.db.createAccommodation(request.payload, (err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Create new accommodation',
                tags: ['api', 'staticdata'],
                validate: {
                    payload: this.joi.object().keys({
                        name: this.joi.string().required(),
                        query_name: this.joi.string().required(),
                        type: this.joi.string().required().valid('accommodation')
                    })
                        .required()
                        .description('city')
                }
            }
        });

        return 'register';
    }
}
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
            name: 'ark-staticdata',
            version: '0.1.0'
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
        // Register

        // get all moods
        server.route({
            method: 'GET',
            path: '/data/moods',
            config: {
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

        // get all moods
        server.route({
            method: 'GET',
            path: '/data/cities',
            config: {
                handler: (request, reply) => {
                    this.db.getCities((err, data) => {
                        if (err) {
                            return reply(this.boom.wrap(err, 400));
                        }
                        reply(data);
                    });
                },
                description: 'Get all cities',
                tags: ['api', 'staticdata']
            }
        });

        // get all accommodations
        server.route({
            method: 'GET',
            path: '/data/acc',
            config: {
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
                        image: this.joi.string(),
                        description: this.joi.string(),
                        excludes: this.joi.isArray(),
                        type: this.joi.string().requred().valid('mood')
                    })
                        .required()
                        .description('Mood object')
                }
            }
        });

        // create new city
        server.route({
            method: 'POST',
            path: '/data/city',
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
                        type: this.joi.string().requred().valid('city')
                    })
                        .required()
                        .description('city')
                }
            }
        });

        // create new city
        server.route({
                method: 'POST',
                path: '/data/acc',
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
                            type: this.joi.string().requred().valid('acc')
                        })
                            .required()
                            .description('city')
                    }
                }
            }
        )
        ;

        return 'register';
    }

    errorInit(error) {
        if (error) {
            console.log('Error: Failed to load plugin (StaticData):', error);
        }
    }
}
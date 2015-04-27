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
                tags: ['api', 'staticdata']
            }
        });

        return 'register';
    }

    errorInit(error) {
        if (error) {
            console.log('Error: Failed to load plugin (StaticData):', error);
        }
    }
}
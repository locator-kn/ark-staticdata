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

    /**
     * Method for creating all needed static data into the database
     * @param database
     * @param callback
     */
    public getSetupData() {
        return (require('./../../staticData.json'));
    }

    private _register(server, options) {
        // get all moods
        server.route({
            method: 'GET',
            path: '/data/moods',
            config: {
                auth: false,
                handler: (request, reply) => {
                    return reply(this.boom.resourceGone('No longer provided'));
                    // TODO: delete route
                    //reply(this.db.getMoods());
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
                    reply(this.db.getCitiesWithTrips());
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
                    return reply(this.boom.resourceGone('No longer provided'));
                    // TODO: delete route
                    //reply(this.db.getAccommodationsEquipment());
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
                    return reply(this.boom.resourceGone('No longer provided'));
                    //this.db.createMood(request.payload, (err, data) => {
                    //    if (err) {
                    //        return reply(this.boom.badRequest(err));
                    //    }
                    //    reply(data);
                    //});
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
                    }).required().description('Mood object')
                }
            }
        });

        // create new equipment for accommodation
        server.route({
            method: 'POST',
            path: '/data/accommodations/equipment',
            config: {
                handler: (request, reply) => {
                    return reply(this.boom.resourceGone('No longer provided'));
                    //this.db.createAccommodationEquipment(request.payload, (err, data) => {
                    //    if (err) {
                    //        return reply(this.boom.wrap(err, 400));
                    //    }
                    //    reply(data);
                    //});
                },
                description: 'Create new accommodation',
                tags: ['api', 'staticdata'],
                validate: {
                    payload: this.joi.object().keys({
                        name: this.joi.string().required(),
                        query_name: this.joi.string().required(),
                        type: this.joi.string().required().valid('accommodation_equipment')
                    }).required().description('equipment')
                }
            }
        });

        return 'register';
    }
}
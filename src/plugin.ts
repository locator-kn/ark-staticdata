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
            path: '/data/location/tags',
            config: {
                auth: false,
                handler: (request, reply) => {
                    reply(this.db.getAllTagsFromLocations());
                },
                description: 'Get all tags used in locations',
                tags: ['api', 'staticdata', 'location', 'tags']
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
                        title: 'T&uuml;bingen'
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

                    reply([konstanz, freiburg, karlsruhe, heidelberg, tuebingen]);
                },
                description: 'Get only Freiburg, Konstanz, Tuebingen, Karlsruhe and Heidelberg',
                tags: ['api', 'staticdata']
            }
        });

        return 'register';
    }
}
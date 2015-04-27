export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class StaticData {
    db:any;

    constructor() {
        this.register.attributes = {
            name: 'ark-staticdata',
            version: '0.1.0'
        };
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

                },
                description: 'Get all moods',
                tags: ['api', 'trip']
            }
        });

        // create new mood
        server.route({
            method: 'POST',
            path: '/data/moods',
            config: {
                handler: (request, reply) => {

                },
                description: 'Create new mood',
                tags: ['api', 'trip']
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
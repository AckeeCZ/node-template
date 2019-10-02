import { expressMiddleware } from 'node-healthz';

// see https://www.npmjs.com/package/node-healthz
export default expressMiddleware({
    // sql: {
    //     adapter: 1,
    //     crucial: true,
    //     type: 'knex',
    // },
    // mongo: {
    //     adapter: 2,
    //     crucial: true,
    //     type: 'mongoose',
    // },
    static: {
        check: () => Promise.resolve('I am OK 😊'),
        crucial: true,
    },
});

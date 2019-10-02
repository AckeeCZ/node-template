import * as request from 'supertest-as-promised';

import app from 'server';

describe('Template (Integration)', () => {
    describe('Server', () => {
        it('Server does respond', () => {
            return request(app)
                .get('/')
                .expect(200);
        });
        it('Healthz', () => {
            return request(app)
                .get('/healthz')
                .expect(200)
                .then(({ body }: any) => {
                    expect(body.tldr).toMatchSnapshot();
                });
        });
    });
});

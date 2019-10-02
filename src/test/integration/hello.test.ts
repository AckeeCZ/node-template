import * as request from 'supertest-as-promised';

import app from 'server';

describe('Hello', () => {
    it('Hello', () => {
        const input = {
            a: 1,
        };
        return request(app)
            .post('/api/hello')
            .send(input)
            .expect(200)
            .then(({ body }: any) => {
                const { payload, ...rest } = body;
                expect(payload).toEqual(input);
                expect(rest).toMatchSnapshot();
            });
    });
});

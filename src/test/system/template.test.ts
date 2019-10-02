import { E_CODES } from 'app/errors';
import { ServerError } from 'app/errors/classes';
import config from 'config';

describe('Template (System)', () => {
    test('Configuration is loaded', () => {
        expect(typeof config).toBe('object');
    });
    describe('Errors', () => {
        test('Throws', () => {
            expect(() => {
                throw new ServerError(E_CODES.TEMPLATE_TEST);
            }).toThrow(ServerError);
        });
        test('Throws with correct name', () => {
            let name = '';
            try {
                throw new ServerError(E_CODES.TEMPLATE_TEST);
            } catch (e) {
                name = e.name;
            }
            expect(name).toBe('ServerError');
        });
        test('Responds to toJson as expected', () => {
            expect(new ServerError(E_CODES.TEMPLATE_TEST, { data: true }).toJSON()).toMatchSnapshot({
                stack: expect.stringContaining('at'),
            });
        });
        test('Works without error code', () => {
            expect(new ServerError().toJSON()).toMatchSnapshot({
                stack: expect.stringContaining('at'),
            });
        });
    });
});

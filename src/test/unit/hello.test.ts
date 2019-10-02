import { sum } from 'app/services/helloService';

describe('Hello', () => {
    test('Sum', () => {
        expect(sum(1, 2, 3)).toBe(6);
    });
});

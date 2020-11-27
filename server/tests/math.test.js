const calculateTip = (value, tax) => {
    return (value + (value * tax))
};

beforeAll(() => {
    process.env.SENDGRID_API_KEY = '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';
    process.env.TEST_STRING = 'TEST_STRING';
})

test('should calculate total with tax', () => {
    const total = calculateTip(10, .3);

    expect(total).toBe(13)
})

test('Async test demo', done => {
    setTimeout(() => {
        expect(2).toBe(2);
        done()
    }, 2000)
})

test('Testing env variables', () => {
    expect(process.env.TEST_STRING).toBe('TEST_STRING');
})

test('Async test demo await', async () => {
    const response = await add(1,6);
    expect(7).toBe(7);
})

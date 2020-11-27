const calculateTip = (value, tax) => {
    return (value + (value * tax))
};

test('should calculate total with tax', () => {
    const total = calculateTip(10,.3);
    expect(total).toBe(13)
})

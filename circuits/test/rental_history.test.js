const { generateProof, verifyProof } = require('./helpers');

describe('Rental History Circuit', () => {
    it('should generate valid proof for sufficient on-time payments', async () => {
        const input = {
            rentalHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // All payments on time
            minimumOnTimePayments: 10
        };

        const { proof, publicSignals } = await generateProof('rental_history', input);
        const isValid = await verifyProof('rental_history', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('1'); // isValid should be 1
    });

    it('should generate invalid proof for insufficient on-time payments', async () => {
        const input = {
            rentalHistory: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Only 5 payments on time
            minimumOnTimePayments: 10
        };

        const { proof, publicSignals } = await generateProof('rental_history', input);
        const isValid = await verifyProof('rental_history', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('0'); // isValid should be 0
    });

    it('should handle edge case of exactly minimum required payments', async () => {
        const input = {
            rentalHistory: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // Exactly 10 payments on time
            minimumOnTimePayments: 10
        };

        const { proof, publicSignals } = await generateProof('rental_history', input);
        const isValid = await verifyProof('rental_history', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('1'); // isValid should be 1 (greater than or equal)
    });
}); 
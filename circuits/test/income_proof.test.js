const { generateProof, verifyProof } = require('./helpers');

describe('Income Proof Circuit', () => {
    it('should generate valid proof for income above minimum', async () => {
        const input = {
            income: 5000,
            minimumIncome: 3000
        };

        const { proof, publicSignals } = await generateProof('income_proof', input);
        const isValid = await verifyProof('income_proof', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('1'); // isValid should be 1
    });

    it('should generate invalid proof for income below minimum', async () => {
        const input = {
            income: 2000,
            minimumIncome: 3000
        };

        const { proof, publicSignals } = await generateProof('income_proof', input);
        const isValid = await verifyProof('income_proof', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('0'); // isValid should be 0
    });

    it('should handle edge case of equal income and minimum', async () => {
        const input = {
            income: 3000,
            minimumIncome: 3000
        };

        const { proof, publicSignals } = await generateProof('income_proof', input);
        const isValid = await verifyProof('income_proof', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('0'); // isValid should be 0 (strictly greater than)
    });
}); 
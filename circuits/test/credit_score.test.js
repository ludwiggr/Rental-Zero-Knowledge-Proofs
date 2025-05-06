const { generateProof, verifyProof } = require('./helpers');

describe('Credit Score Circuit', () => {
    it('should generate valid proof for credit score above minimum', async () => {
        const input = {
            creditScore: 750,
            minimumScore: 700
        };

        const { proof, publicSignals } = await generateProof('credit_score', input);
        const isValid = await verifyProof('credit_score', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('1'); // isValid should be 1
    });

    it('should generate invalid proof for credit score below minimum', async () => {
        const input = {
            creditScore: 650,
            minimumScore: 700
        };

        const { proof, publicSignals } = await generateProof('credit_score', input);
        const isValid = await verifyProof('credit_score', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('0'); // isValid should be 0
    });

    it('should handle edge case of equal credit score and minimum', async () => {
        const input = {
            creditScore: 700,
            minimumScore: 700
        };

        const { proof, publicSignals } = await generateProof('credit_score', input);
        const isValid = await verifyProof('credit_score', proof, publicSignals);
        
        expect(isValid).toBe(true);
        expect(publicSignals[0]).toBe('1'); // isValid should be 1 (greater than or equal)
    });
}); 
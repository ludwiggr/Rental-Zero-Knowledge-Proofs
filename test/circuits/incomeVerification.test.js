import { describe, it, expect, beforeAll } from 'vitest';
import { loadCircuit, generateProof, verifyProof, toFieldElement, isValidProof } from './setup';

describe('Income Verification Circuit', () => {
  let circuit;

  beforeAll(async () => {
    circuit = await loadCircuit('incomeVerification');
  });

  describe('Valid Income Proofs', () => {
    it('should generate and verify proof for income above threshold', async () => {
      const input = {
        income: toFieldElement(5000), // $5000 monthly income
        threshold: toFieldElement(3000), // $3000 threshold
        salt: toFieldElement(12345) // Random salt
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      const isValid = await verifyProof(circuit, proof, publicSignals);

      expect(isValid).toBe(true);
      expect(publicSignals[0]).toBe('1'); // Should output 1 for valid proof
    });

    it('should handle income exactly at threshold', async () => {
      const input = {
        income: toFieldElement(3000),
        threshold: toFieldElement(3000),
        salt: toFieldElement(67890)
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      const isValid = await verifyProof(circuit, proof, publicSignals);

      expect(isValid).toBe(true);
      expect(publicSignals[0]).toBe('1');
    });
  });

  describe('Invalid Income Proofs', () => {
    it('should reject proof for income below threshold', async () => {
      const input = {
        income: toFieldElement(2000), // $2000 monthly income
        threshold: toFieldElement(3000), // $3000 threshold
        salt: toFieldElement(54321)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(false);
    });

    it('should reject proof with negative income', async () => {
      const input = {
        income: toFieldElement(-1000),
        threshold: toFieldElement(3000),
        salt: toFieldElement(98765)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(false);
    });
  });

  describe('Circuit Constraints', () => {
    it('should maintain privacy of actual income', async () => {
      const input = {
        income: toFieldElement(5000),
        threshold: toFieldElement(3000),
        salt: toFieldElement(11111)
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      
      // Public signals should not reveal the actual income
      expect(publicSignals.length).toBe(1); // Only the result should be public
      expect(publicSignals[0]).toBe('1'); // Just the verification result
    });

    it('should handle different salt values', async () => {
      const baseInput = {
        income: toFieldElement(5000),
        threshold: toFieldElement(3000)
      };

      // Generate two proofs with different salts
      const proof1 = await generateProof(circuit, {
        ...baseInput,
        salt: toFieldElement(11111)
      });

      const proof2 = await generateProof(circuit, {
        ...baseInput,
        salt: toFieldElement(22222)
      });

      // Both proofs should be valid
      expect(await verifyProof(circuit, proof1.proof, proof1.publicSignals)).toBe(true);
      expect(await verifyProof(circuit, proof2.proof, proof2.publicSignals)).toBe(true);

      // But the proofs should be different
      expect(proof1.proof).not.toEqual(proof2.proof);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large income values', async () => {
      const input = {
        income: toFieldElement(1000000), // $1M monthly income
        threshold: toFieldElement(3000),
        salt: toFieldElement(99999)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(true);
    });

    it('should handle zero threshold', async () => {
      const input = {
        income: toFieldElement(5000),
        threshold: toFieldElement(0),
        salt: toFieldElement(88888)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(true);
    });
  });
}); 
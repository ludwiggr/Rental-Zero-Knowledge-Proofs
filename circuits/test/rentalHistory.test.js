import { describe, it, expect, beforeAll } from 'vitest';
import { loadCircuit, generateProof, verifyProof, toFieldElement, isValidProof } from './setup';

describe('Rental History Circuit', () => {
  let circuit;

  beforeAll(async () => {
    circuit = await loadCircuit('rentalHistory');
  });

  describe('Valid Rental History Proofs', () => {
    it('should verify good rental history', async () => {
      const input = {
        onTimePayments: toFieldElement(12), // 12 months of on-time payments
        requiredPayments: toFieldElement(12),
        salt: toFieldElement(12345)
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      const isValid = await verifyProof(circuit, proof, publicSignals);

      expect(isValid).toBe(true);
      expect(publicSignals[0]).toBe('1'); // Should output 1 for valid proof
    });

    it('should verify history with some late payments', async () => {
      const input = {
        onTimePayments: toFieldElement(10), // 10 on-time, 2 late
        requiredPayments: toFieldElement(12),
        salt: toFieldElement(67890)
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      const isValid = await verifyProof(circuit, proof, publicSignals);

      expect(isValid).toBe(true);
      expect(publicSignals[0]).toBe('1');
    });
  });

  describe('Invalid Rental History Proofs', () => {
    it('should reject history with too many late payments', async () => {
      const input = {
        onTimePayments: toFieldElement(8), // 8 on-time, 4 late
        requiredPayments: toFieldElement(12),
        salt: toFieldElement(54321)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(false);
    });

    it('should reject history with negative payments', async () => {
      const input = {
        onTimePayments: toFieldElement(-1),
        requiredPayments: toFieldElement(12),
        salt: toFieldElement(98765)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(false);
    });
  });

  describe('Circuit Constraints', () => {
    it('should maintain privacy of actual payment history', async () => {
      const input = {
        onTimePayments: toFieldElement(12),
        requiredPayments: toFieldElement(12),
        salt: toFieldElement(11111)
      };

      const { proof, publicSignals } = await generateProof(circuit, input);
      
      // Public signals should not reveal the actual payment history
      expect(publicSignals.length).toBe(1); // Only the result should be public
      expect(publicSignals[0]).toBe('1'); // Just the verification result
    });

    it('should handle different salt values', async () => {
      const baseInput = {
        onTimePayments: toFieldElement(12),
        requiredPayments: toFieldElement(12)
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
    it('should handle long rental history', async () => {
      const input = {
        onTimePayments: toFieldElement(60), // 5 years of on-time payments
        requiredPayments: toFieldElement(60),
        salt: toFieldElement(99999)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(true);
    });

    it('should handle zero required payments', async () => {
      const input = {
        onTimePayments: toFieldElement(0),
        requiredPayments: toFieldElement(0),
        salt: toFieldElement(88888)
      };

      const isValid = await isValidProof(circuit, input);
      expect(isValid).toBe(true);
    });
  });
}); 
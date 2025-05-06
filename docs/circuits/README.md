# Zero-Knowledge Proof Circuits

This document describes the zero-knowledge proof circuits used in the Rental ZKP system.

## Overview

The system uses three main circuits:
1. Income Verification
2. Rental History Verification
3. Credit Score Verification

## Circuit Structure

Each circuit follows this general structure:
```
circuits/
├── src/
│   ├── income.circom
│   ├── rentalHistory.circom
│   └── creditScore.circom
├── build/
│   ├── income.r1cs
│   ├── rentalHistory.r1cs
│   └── creditScore.r1cs
└── artifacts/
    ├── income.zkey
    ├── rentalHistory.zkey
    └── creditScore.zkey
```

## Income Verification Circuit

### Purpose
Proves that a tenant's income meets the property's minimum requirement without revealing the actual income.

### Inputs
- Private:
  - `income`: Actual monthly income
  - `salt`: Random value for privacy
- Public:
  - `threshold`: Minimum required income

### Outputs
- `valid`: Boolean indicating if income meets threshold

### Example
```circom
pragma circom 2.0.0;

template IncomeVerification() {
    // Private inputs
    signal private input income;
    signal private input salt;
    
    // Public inputs
    signal input threshold;
    
    // Output
    signal output valid;
    
    // Verify income >= threshold
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== income;
    greaterThan.in[1] <== threshold;
    
    valid <== greaterThan.out;
}

component main = IncomeVerification();
```

## Rental History Circuit

### Purpose
Proves that a tenant has a good rental history without revealing specific details.

### Inputs
- Private:
  - `history`: Array of rental history entries
  - `salt`: Random value for privacy
- Public:
  - `minDuration`: Minimum required rental duration
  - `maxLatePayments`: Maximum allowed late payments

### Outputs
- `valid`: Boolean indicating if history meets requirements

### Example
```circom
pragma circom 2.0.0;

template RentalHistoryVerification() {
    // Private inputs
    signal private input history[10];
    signal private input salt;
    
    // Public inputs
    signal input minDuration;
    signal input maxLatePayments;
    
    // Output
    signal output valid;
    
    // Verify rental history
    component durationCheck = DurationCheck();
    component paymentCheck = PaymentCheck();
    
    // ... circuit logic ...
}

component main = RentalHistoryVerification();
```

## Credit Score Circuit

### Purpose
Proves that a tenant's credit score meets the minimum requirement without revealing the actual score.

### Inputs
- Private:
  - `creditScore`: Actual credit score
  - `salt`: Random value for privacy
- Public:
  - `threshold`: Minimum required credit score

### Outputs
- `valid`: Boolean indicating if credit score meets threshold

### Example
```circom
pragma circom 2.0.0;

template CreditScoreVerification() {
    // Private inputs
    signal private input creditScore;
    signal private input salt;
    
    // Public inputs
    signal input threshold;
    
    // Output
    signal output valid;
    
    // Verify credit score >= threshold
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== creditScore;
    greaterThan.in[1] <== threshold;
    
    valid <== greaterThan.out;
}

component main = CreditScoreVerification();
```

## Circuit Development

### Prerequisites
- Node.js 18+
- circom 2.0.0+
- snarkjs 0.7.0+

### Setup
```bash
cd circuits
npm install
```

### Compilation
```bash
# Compile all circuits
npm run compile

# Compile specific circuit
npm run compile:income
npm run compile:rental-history
npm run compile:credit-score
```

### Testing
```bash
# Run all circuit tests
npm test

# Run specific circuit tests
npm run test:income
npm run test:rental-history
npm run test:credit-score
```

### Trusted Setup
```bash
# Generate zkey files
npm run setup:income
npm run setup:rental-history
npm run setup:credit-score
```

## Security Considerations

1. **Salt Usage**
   - Each proof must use a unique salt
   - Salt should be cryptographically secure random value
   - Salt should be at least 32 bytes long

2. **Circuit Constraints**
   - All constraints must be properly defined
   - No underconstrained signals
   - No overconstrained signals

3. **Input Validation**
   - Validate all inputs before circuit execution
   - Check for out-of-range values
   - Verify input formats

4. **Proof Verification**
   - Verify proofs on-chain when possible
   - Use secure verification keys
   - Implement proper error handling

## Performance Optimization

1. **Circuit Size**
   - Minimize number of constraints
   - Use efficient constraint patterns
   - Optimize complex operations

2. **Proof Generation**
   - Use efficient proving keys
   - Implement parallel processing
   - Cache intermediate results

3. **Verification**
   - Use efficient verification keys
   - Implement batch verification
   - Cache verification results

## Integration

### Frontend Integration
```javascript
import { generateProof } from '@rental-zkp/circuits';

// Generate income proof
const proof = await generateProof('income', {
  income: 5000,
  threshold: 3000,
  salt: randomBytes(32)
});
```

### Backend Integration
```javascript
import { verifyProof } from '@rental-zkp/circuits';

// Verify income proof
const isValid = await verifyProof('income', {
  proof,
  publicSignals: [3000]
});
```

## More Information

- [Circuit Development Guide](development.md)
- [Security Best Practices](security.md)
- [Performance Optimization](performance.md)
- [Integration Guide](integration.md) 
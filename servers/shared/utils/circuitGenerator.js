import { plonk, groth16 } from 'snarkjs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const generateCircuit = async (circuitName, circuitCode) => {
    try {
        // Create circuits directory if it doesn't exist
        const circuitsDir = join(__dirname, '../circuits');
        if (!existsSync(circuitsDir)) {
            mkdirSync(circuitsDir, { recursive: true });
        }

        // Write circuit code to file
        const circuitPath = join(circuitsDir, `${circuitName}.circom`);
        writeFileSync(circuitPath, circuitCode);

        // Generate circuit artifacts
        const { circuit, provingKey, verificationKey } = await groth16.setup(circuitPath);

        // Save verification key
        const vkPath = join(circuitsDir, `${circuitName}_vk.json`);
        writeFileSync(vkPath, JSON.stringify(verificationKey));

        return { circuit, provingKey, verificationKey };
    } catch (error) {
        console.error('Error generating circuit:', error);
        throw error;
    }
};

const generateIncomeCircuit = async () => {
    const circuitCode = `
pragma circom 2.0.0;

// Circuit to verify income is at least 3000 EUR
template IncomeVerification() {
    // Private inputs
    signal private input income;  // Actual income value
    signal private input threshold = 3000;  // Fixed threshold of 3000 EUR

    // Public inputs
    signal output isValid;

    // Verify income is above threshold
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== income;
    greaterThan.in[1] <== threshold;
    isValid <== greaterThan.out;
}

component main = IncomeVerification();
    `;

    return generateCircuit('income_verification', circuitCode);
};

const generateCreditScoreCircuit = async () => {
    const circuitCode = `
pragma circom 2.0.0;

// Circuit to verify credit score is at least 700
template CreditScoreVerification() {
    // Private inputs
    signal private input creditScore;  // Actual credit score
    signal private input threshold = 700;  // Fixed threshold of 700

    // Public inputs
    signal output isValid;

    // Verify credit score is above threshold
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== creditScore;
    greaterThan.in[1] <== threshold;
    isValid <== greaterThan.out;
}

component main = CreditScoreVerification();
    `;

    return generateCircuit('credit_score_verification', circuitCode);
};

// Metadata for each issuer
const issuerMetadata = {
    employer: {
        name: "Employer Verification Service",
        circuit: "income_verification",
        threshold: 3000,
        currency: "EUR",
        description: "Verifies that an individual's income is at least 3000 EUR"
    },
    bank: {
        name: "Bank Credit Score Service",
        circuit: "credit_score_verification",
        threshold: 700,
        description: "Verifies that an individual's credit score is at least 700"
    }
};

export default {
    generateIncomeCircuit,
    generateCreditScoreCircuit,
    issuerMetadata
}; 
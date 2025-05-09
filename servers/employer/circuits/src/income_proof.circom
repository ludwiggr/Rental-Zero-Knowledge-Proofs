pragma circom 2.0.0;

include "../../../../node_modules/circomlib/circuits/comparators.circom";

template IncomeProof() {
    // Private inputs
    signal input monthlyIncome;
    signal input attestationHash;

    // Public inputs
    signal input minimumIncome;
    signal input currencyHash;

    // Output
    signal output out;

    // Verify income is above minimum
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== monthlyIncome;
    greaterThan.in[1] <== minimumIncome;

    // Verify attestation hash matches
    component attestationCheck = IsEqual();
    attestationCheck.in[0] <== attestationHash;
    attestationCheck.in[1] <== currencyHash;

    // Final output
    out <== greaterThan.out * attestationCheck.out;
}

component main = IncomeProof();
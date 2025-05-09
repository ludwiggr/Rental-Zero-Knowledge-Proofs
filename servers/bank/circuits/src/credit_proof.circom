pragma circom 2.0.0;

include "../../../../node_modules/circomlib/circuits/comparators.circom";

template CreditScore() {
    // Private inputs
    signal input creditScore;
    signal input attestationHash;

    // Public inputs
    signal input minimumScore;
    signal input customerHash;

    // Output
    signal output out;

    // Verify credit score is above minimum
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== creditScore;
    greaterThan.in[1] <== minimumScore;

    // Verify attestation hash matches
    component attestationCheck = IsEqual();
    attestationCheck.in[0] <== attestationHash;
    attestationCheck.in[1] <== customerHash;

    // Final output
    out <== greaterThan.out * attestationCheck.out;
}

component main = CreditScore(); 
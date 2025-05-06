pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template CreditScore() {
    // Private inputs
    signal input creditScore;
    signal input minimumScore;

    // Public inputs
    signal output isValid;

    // Compare creditScore with minimumScore
    component gte = GreaterEqThan(32);
    gte.in[0] <== creditScore;
    gte.in[1] <== minimumScore;
    isValid <== gte.out;
}

component main = CreditScore(); 
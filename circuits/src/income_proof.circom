pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template IncomeProof() {
    // Private inputs
    signal input income;
    signal input minimumIncome;

    // Public inputs
    signal output isValid;

    // Compare income with minimumIncome
    component gt = GreaterThan(32);
    gt.in[0] <== income;
    gt.in[1] <== minimumIncome;
    isValid <== gt.out;
}

component main = IncomeProof(); 
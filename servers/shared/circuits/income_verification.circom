
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
    
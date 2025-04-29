pragma circom 2.0.0;

template IncomeProof() {
    // Private inputs
    signal private input income;
    signal private input minimumIncome;

    // Public inputs
    signal output isValid;

    // Constraints
    component greaterThan = GreaterThan(32);
    greaterThan.in[0] <== income;
    greaterThan.in[1] <== minimumIncome;
    isValid <== greaterThan.out;
}

template GreaterThan(n) {
    signal input in[2];
    signal output out;

    component lt = LessThan(n);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0];
    out <== lt.out;
}

template LessThan(n) {
    signal input in[2];
    signal output out;

    signal bits[n];
    signal inverse[n];

    component isZero = IsZero();
    isZero.in <== in[1] - in[0];
    out <== isZero.out;

    for (var i = 0; i < n; i++) {
        bits[i] <== (in[1] - in[0]) >> i;
        inverse[i] <== 1 - bits[i];
    }
}

template IsZero() {
    signal input in;
    signal output out;

    signal inv;
    inv <== in != 0 ? 1/in : 0;
    out <== 1 - (in * inv);
}

component main = IncomeProof(); 
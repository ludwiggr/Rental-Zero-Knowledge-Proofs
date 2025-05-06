pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template RentalHistory() {
    // Private inputs
    signal input rentalHistory[12]; // 1 = paid on time, 0 = late payment
    signal input minimumOnTimePayments;

    // Public inputs
    signal output isValid;

    // Sum up on-time payments
    signal sum;
    sum <== rentalHistory[0] + rentalHistory[1] + rentalHistory[2] + 
           rentalHistory[3] + rentalHistory[4] + rentalHistory[5] + 
           rentalHistory[6] + rentalHistory[7] + rentalHistory[8] + 
           rentalHistory[9] + rentalHistory[10] + rentalHistory[11];

    // Compare sum with minimumOnTimePayments
    component gte = GreaterEqThan(32);
    gte.in[0] <== sum;
    gte.in[1] <== minimumOnTimePayments;
    isValid <== gte.out;
}

component main = RentalHistory(); 
# Decentralized Zero-Knowledge Proof Rental Verification System

A secure and privacy-preserving apartment rental system that uses zero-knowledge proofs to verify tenant qualifications without revealing sensitive information. The system is built on a decentralized architecture with separate servers for attestations and clients for proving and verification.
https://www.youtube.com/watch?v=ZuwUFN7m4AY

## System Architecture

### Servers (Attestation Providers)

1. **Employer Server**
   - Publishes income verification circuit
   - Signs income attestations
   - Provides API for income verification

2. **Bank Server**
   - Publishes credit score verification circuit
   - Signs credit score attestations
   - Provides API for credit score verification

### Clients

1. **Renter (Prover)**
   - Collects attestations from servers
   - Runs local proving system
   - Generates SNARK proofs
   - Manages private data

2. **Landlord (Verifier)**
   - Verifies SNARK proofs
   - Manages property listings
   - Handles rental applications

## Features

- 🔐 Zero-knowledge proof verification for:
  - Income requirements (Employer attestation)
  - Credit score (Bank attestation)
- 🏢 Property listing and management
- 👥 User authentication and authorization
- 💬 Secure tenant-landlord communication
- 📱 Modern, responsive UI with Material-UI
- 🔍 Comprehensive test coverage
- 🚀 CI/CD pipeline with GitHub Actions

## Tech Stack

- **Frontend**: 
  - React.js (v18.2.0)
  - Material-UI (v5.12.1)
  - React Router DOM (v6.22.3)
  - Webpack (v5.90.3)
  - Babel (v7.24.0)

- **Backend**: 
  - Node.js
  - Fastify (v4.26.2)
  - Express.js (v4.18.2)
  - Zod (v3.21.4) for validation

- **Database**: 
  - MongoDB (v7.8.7)
  - Mongoose (v7.8.7)

- **Zero-Knowledge Proofs**: 
  - Circom
  - snarkjs (v0.7.0)

- **Authentication**: 
  - JWT (@fastify/jwt v7.2.4)
  - bcryptjs (v2.4.3)

- **Testing**:
  - Frontend: Jest, React Testing Library
  - Backend: Vitest (v1.3.1)

## Project Structure

```
/
├── servers/                # Attestation servers
│   ├── employer/          # Employer server
│   │   ├── src/          # Source code
│   │   ├── circuits/     # Income verification circuit
│   │   └── tests/        # Server tests
│   └── bank/             # Bank server
│       ├── src/          # Source code
│       ├── circuits/     # Credit score circuit
│       └── tests/        # Server tests
├── clients/               # Client applications
│   ├── renter/           # Renter (Prover) client
│   │   ├── src/         # Source code
│   │   └── tests/       # Client tests
│   └── landlord/         # Landlord (Verifier) client
│       ├── src/         # Source code
│       └── tests/       # Client tests
├── circuits/             # Shared circuits
│   ├── income/          # Income verification circuit
│   └── credit/          # Credit score circuit
├── docs/                # Documentation
└── scripts/            # Utility scripts
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rental-Zero-Knowledge-Proofs
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install server dependencies
   cd servers/employer && npm install
   cd ../bank && npm install

   # Install client dependencies
   cd ../../clients/renter && npm install
   cd ../landlord && npm install
   ```

3. **Start the servers**
   ```bash
   # Start employer server
   cd servers/employer
   npm start

   # Start bank server
   cd ../bank
   npm start
   ```

4. **Start the clients**
   ```bash
   # Start renter client
   cd clients/renter
   npm start

   # Start landlord client
   cd ../landlord
   npm start
   ```

## Development

### Server Development

1. **Employer Server**
   - Handles income verification
   - Signs income attestations
   - Publishes income circuit

2. **Bank Server**
   - Handles credit score verification
   - Signs credit score attestations
   - Publishes credit score circuit

### Client Development

1. **Renter Client**
   - Collects attestations
   - Generates proofs
   - Manages private data

2. **Landlord Client**
   - Verifies proofs
   - Manages properties
   - Handles applications

## Testing

Run tests for each component:

```bash
# Test employer server
cd servers/employer
npm test

# Test bank server
cd ../bank
npm test

# Test renter client
cd ../../clients/renter
npm test

# Test landlord client
cd ../landlord
npm test
```

## Security

- All sensitive data is handled using zero-knowledge proofs
- JWT authentication with secure token management
- Environment variables for sensitive configuration
- Regular security audits and dependency updates

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [documentation](docs/README.md)
2. Search existing [issues](https://github.com/yourusername/Rental-Zero-Knowledge-Proofs/issues)
3. Create a new issue if needed





Employer:
    circuit_income := defineCircuit("income ≥ 3000 EUR")
    verifying_key_income := generateVerifyingKey(circuit_income)
    publish(circuit_income, verifying_key_income, issuer_metadata)

Bank:
    circuit_credit := defineCircuit("credit_score ≥ 700")
    verifying_key_credit := generateVerifyingKey(circuit_credit)
    publish(circuit_credit, verifying_key_credit, issuer_metadata)


Employer → Renter:
    renter_income := getIncomeFromHR(renter_id)
    signed_attestation_income := signWithEmployerKey({
        "renter_id": renter_id,
        "income": renter_income,
        "expires_at": "2025-06-30"
    })
    sendToRenter(signed_attestation_income)

Bank → Renter:
    renter_credit_score := getCreditScore(renter_id)
    signed_attestation_credit := signWithBankKey({
        "renter_id": renter_id,
        "credit_score": renter_credit_score,
        "expires_at": "2025-06-30"
    })
    sendToRenter(signed_attestation_credit)


Renter device:
    verifySignature(signed_attestation_income, employer_public_key)
    verifySignature(signed_attestation_credit, bank_public_key)

    prover_input_income := {
        "income": signed_attestation_income["income"],
        "signature": signed_attestation_income["signature"]
    }

    prover_input_credit := {
        "credit_score": signed_attestation_credit["credit_score"],
        "signature": signed_attestation_credit["signature"]
    }

    proof_income := runProver(circuit_income, prover_input_income)
    proof_credit := runProver(circuit_credit, prover_input_credit)

    package := {
        "proof_income": proof_income,
        "proof_credit": proof_credit,
        "attestation_metadata": {
            "employer": employer_metadata,
            "bank": bank_metadata
        }
    }

    sendToLandlord(package)


Landlord:
    verifying_key_income := fetchFromRegistry(employer_metadata["verifying_key_url"])
    verifying_key_credit := fetchFromRegistry(bank_metadata["verifying_key_url"])

    isValidIncome := verifyProof(proof_income, verifying_key_income, circuit_income)
    isValidCredit := verifyProof(proof_credit, verifying_key_credit, circuit_credit)

    if isValidIncome and isValidCredit:
        approveRental(renter_id)
    else:
        rejectRental(renter_id)


Landlord:
    checkNotExpired(signed_attestation_income["expires_at"])
    checkNotExpired(signed_attestation_credit["expires_at"])

    checkRevocationRegistry(signed_attestation_income)
    checkRevocationRegistry(signed_attestation_credit)

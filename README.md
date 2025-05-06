# Zero-Knowledge Proof Apartment Rental System

A secure and privacy-preserving apartment rental system that uses zero-knowledge proofs to verify tenant qualifications without revealing sensitive information.

## Project Overview

- 🔐 Zero-knowledge proof verification for:
  - Income requirements
  - Credit score
- 🏢 Property listing and management
- 👥 User authentication and authorization
- 💬 Secure tenant-landlord communication
- 📱 Modern, responsive UI with Material-UI
- 🔍 Comprehensive test coverage
- 🚀 CI/CD pipeline with GitHub Actions

This project implements a Zero Knowledge Proof (ZKP) system for rental verification, allowing users to prove their eligibility for rental properties without revealing sensitive personal information. The system consists of two main circuits that verify different aspects of rental eligibility:

1. **Income Proof Circuit**: Verifies that a user's income meets or exceeds a minimum threshold without revealing the actual income amount.
2. **Credit Score Circuit**: Demonstrates that a user's credit score meets the minimum requirement without revealing the actual score.

## Design Best Practices

### 1. Privacy by Design
- **Zero Knowledge**: The system ensures that sensitive information (income, credit score, payment history) remains private while still proving eligibility.
- **Selective Disclosure**: Users can prove specific claims without revealing the underlying data.
- **Data Minimization**: Only the minimum necessary information is used to generate proofs.

### 2. Circuit Design
- **Modular Architecture**: Each circuit is designed to handle a specific verification aspect, making the system modular and maintainable.
- **Efficient Constraints**: Circuits use circomlib's comparators for efficient constraint generation.
- **Clear Input/Output Interface**: Each circuit has well-defined private inputs, public inputs, and outputs.

### 3. Code Organization
- **Separation of Concerns**: Circuits, tests, and build scripts are organized in separate directories.
- **Clear Directory Structure**:
  ```
  circuits/
  ├── src/           # Circuit source files
  ├── test/          # Test files
  ├── build/         # Compiled circuits
  ├── artifacts/     # Generated keys and proofs
  └── scripts/       # Build and setup scripts
  ```

### 4. Testing Strategy
- **Comprehensive Test Coverage**: Each circuit has tests for:
  - Valid input scenarios
  - Invalid input scenarios
  - Edge cases
- **Test Helpers**: Common test utilities are shared across test files.
- **Automated Testing**: Jest is used for automated test execution.

### 5. Security Considerations
- **Trusted Setup**: Uses a secure powers of tau ceremony for circuit setup.
- **Key Management**: Separate proving and verification keys for each circuit.
- **Input Validation**: Circuits validate inputs to prevent invalid proofs.

### 6. Development Workflow
- **Build Automation**: Automated compilation and setup scripts.
- **Dependency Management**: Clear package management with version control.
- **Documentation**: Comprehensive documentation of circuits and APIs.

### 7. Performance Optimization
- **Efficient Circuit Design**: Minimized number of constraints.
- **Optimized Proof Generation**: Uses groth16 proving system for efficient proofs.
- **Compact Proof Size**: Generated proofs are optimized for size and verification speed.

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

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rental-Zero-Knowledge-Proofs
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Start the development servers**
   ```bash
   npm start
   ```

## Running the Application

### Client Application

1. **Navigate to the client directory**
   ```bash
   cd client
   ```

2. **Install client dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   This will start the React development server on `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `build` directory.

5. **Run client tests**
   ```bash
   npm test
   ```

### Development Features
- Hot reloading enabled
- ESLint for code quality
- Prettier for code formatting
- Source maps for debugging
- Development proxy for API requests

### Environment Variables
Create a `.env` file in the client directory with:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

## Project Structure

```
/
├── client/                 # Frontend application
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   ├── public/           # Static files
│   └── webpack.config.js # Webpack configuration
├── server/                # Backend application
│   ├── src/              # Source code
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── config/           # Configuration files
├── circuits/             # Zero-knowledge proof circuits
│   ├── src/             # Circuit source files
│   ├── build/           # Compiled circuits
│   └── artifacts/       # Generated proofs and keys
├── test/                # All tests
│   ├── client/         # Frontend tests
│   ├── server/         # Backend tests
│   └── circuits/       # Circuit tests
├── docs/               # Documentation
└── scripts/           # Utility scripts
```

## Available Scripts

- `npm start` - Start development servers
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage reports
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier
- `npm run setup` - Run project setup script
- `npm run clean` - Clean all node_modules

## Documentation

Detailed documentation is available in the `docs` directory:

- [Development Setup](docs/setup/development.md)
- [API Documentation](docs/api/README.md)
- [Circuit Documentation](docs/circuits/README.md)
- [Architecture Overview](docs/architecture/overview.md)
- [Contributing Guide](docs/contributing/workflow.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

The project uses a comprehensive testing setup:

- **Frontend**: Jest + React Testing Library
- **Backend**: Vitest
- **Circuits**: Custom test suite for zero-knowledge proofs

Run tests with:
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:client
npm run test:server
npm run test:circuits

# Run tests in watch mode
npm run test:watch

# Generate coverage reports
npm run test:coverage
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



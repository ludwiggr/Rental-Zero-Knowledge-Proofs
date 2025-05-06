# Zero-Knowledge Proof Apartment Rental System

A secure and privacy-preserving apartment rental system that uses zero-knowledge proofs to verify tenant qualifications without revealing sensitive information.

## Features

- 🔐 Zero-knowledge proof verification for:
  - Income requirements
  - Rental history
  - Credit score
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

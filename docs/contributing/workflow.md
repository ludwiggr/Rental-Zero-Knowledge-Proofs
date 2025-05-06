# Contributing Guide

## Development Workflow

### 1. Setup Development Environment

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork
   git clone https://github.com/your-username/Rental-Zero-Knowledge-Proofs.git
   cd Rental-Zero-Knowledge-Proofs
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install

   # Install circuit dependencies
   cd ../circuits && npm install
   ```

3. **Setup Environment Variables**
   ```bash
   # Copy example env files
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

### 2. Branch Management

1. **Create Feature Branch**
   ```bash
   # Create and switch to new branch
   git checkout -b feature/your-feature-name
   ```

2. **Branch Naming Convention**
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Adding or modifying tests
   - `chore/` - Maintenance tasks

### 3. Development Process

1. **Start Development Servers**
   ```bash
   # Start all services
   npm start

   # Or start individually
   cd client && npm start
   cd server && npm run dev
   ```

2. **Run Tests**
   ```bash
   # Run all tests
   npm test

   # Run specific test suites
   npm run test:client
   npm run test:server
   npm run test:circuits
   ```

3. **Code Quality**
   ```bash
   # Run linter
   npm run lint

   # Format code
   npm run format
   ```

### 4. Commit Guidelines

1. **Commit Message Format**
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

2. **Types**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation
   - `style`: Formatting
   - `refactor`: Code restructuring
   - `test`: Adding tests
   - `chore`: Maintenance

3. **Examples**
   ```
   feat(auth): add JWT authentication
   fix(api): resolve rate limiting issue
   docs(readme): update installation steps
   ```

### 5. Pull Request Process

1. **Before Submitting**
   - Update documentation
   - Add/update tests
   - Run linter and formatter
   - Ensure all tests pass

2. **PR Description**
   - Describe changes
   - Link related issues
   - Include test results
   - Add screenshots if UI changes

3. **Review Process**
   - Address review comments
   - Update PR if needed
   - Wait for approval
   - Merge after approval

### 6. Circuit Development

1. **Circuit Structure**
   ```
   circuits/
   ├── src/
   │   └── your-circuit.circom
   ├── test/
   │   └── your-circuit.test.js
   └── artifacts/
       └── your-circuit.zkey
   ```

2. **Development Steps**
   ```bash
   # Compile circuit
   npm run compile:your-circuit

   # Run tests
   npm run test:your-circuit

   # Generate zkey
   npm run setup:your-circuit
   ```

3. **Testing Circuits**
   - Write test cases
   - Verify constraints
   - Check edge cases
   - Validate outputs

### 7. Code Review Guidelines

1. **What to Review**
   - Code quality
   - Test coverage
   - Documentation
   - Security considerations
   - Performance impact

2. **Review Process**
   - Check for bugs
   - Verify test coverage
   - Review documentation
   - Assess security
   - Evaluate performance

3. **Feedback**
   - Be constructive
   - Provide examples
   - Suggest improvements
   - Explain reasoning

### 8. Release Process

1. **Version Management**
   - Follow semantic versioning
   - Update CHANGELOG.md
   - Tag releases
   - Update documentation

2. **Release Steps**
   ```bash
   # Update version
   npm version patch|minor|major

   # Create release branch
   git checkout -b release/v1.0.0

   # Update changelog
   # Create PR
   # Merge after review
   # Tag release
   ```

### 9. Maintenance

1. **Regular Tasks**
   - Update dependencies
   - Run security audits
   - Update documentation
   - Monitor performance

2. **Issue Management**
   - Label issues
   - Assign priorities
   - Track progress
   - Close resolved issues

### 10. Communication

1. **Channels**
   - GitHub Issues
   - Pull Requests
   - Discussion Board
   - Community Chat

2. **Best Practices**
   - Be respectful
   - Provide context
   - Use clear language
   - Follow up on discussions

## Getting Help

- Check [documentation](README.md)
- Search [issues](https://github.com/yourusername/Rental-Zero-Knowledge-Proofs/issues)
- Join community chat
- Contact maintainers 
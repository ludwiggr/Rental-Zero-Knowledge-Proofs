# Zero-Knowledge Proof Apartment Rental System

This project implements a zero-knowledge proof system for apartment rentals, allowing tenants to prove they meet certain criteria without revealing sensitive information.

## What is a Zero-Knowledge Proof?

A zero-knowledge proof is a way to prove something is true without revealing the actual information. In our rental system, this means:
- Tenants can prove they meet income requirements
- Landlords can verify the proof
- The actual income amount remains private

## Features

- Zero-knowledge proof verification for income requirements
- Secure tenant-landlord communication
- Property listing and management
- User authentication and authorization
- Modern, responsive UI

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Zero-Knowledge Proofs**: Circom, snarkjs
- **Authentication**: JWT

## Prerequisites

Before you begin, you'll need to install:

1. **Node.js and npm**
   - Install Node Version Manager (nvm) first:
     - Windows: Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
     - macOS/Linux: 
       ```bash
       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
       ```
     - After installation, restart your terminal
   
   - Then install Node.js using nvm:
     ```bash
     # Install Node.js 18 (LTS version)
     nvm install 18
     
     # Use Node.js 18
     nvm use 18
     
     # Make Node.js 18 the default version
     nvm alias default 18
     
     # Verify installation
     node --version  # Should show v18.x.x
     npm --version   # Should show 8.x.x or higher
     ```

   > **Note**: If you're using a different Node.js version, you can switch to v18 using `nvm use 18`. To make this change permanent, run `nvm alias default 18`.

2. **MongoDB**
   - Windows: Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - macOS: Install using Homebrew: `brew install mongodb-community`
   - Linux: Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Git**
   - Windows: Download and install from [git-scm.com](https://git-scm.com/download/win)
   - macOS: Install using Homebrew: `brew install git`
   - Linux: `sudo apt install git`

## Installation Guide

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Rental-Zero-Knowledge-Proofs
```

### Step 2: Set up the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   echo "PORT=8080
   MONGODB_URI=mongodb://localhost:27017/rental-zkp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development" > .env
   ```

4. Start MongoDB:
   - Windows: MongoDB should run as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

5. Start the server:
   ```bash
   npm run dev
   ```

### Step 3: Set up the Frontend

1. Open a new terminal window
2. Navigate to the client directory:
   ```bash
   cd client
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```bash
   echo "REACT_APP_API_URL=http://localhost:8080" > .env
   ```

5. Start the client:
   ```bash
   npm start
   ```

## Accessing the Application

- Frontend: Open your browser and go to `http://localhost:3000`
- Backend API: `http://localhost:8080`

## Common Issues and Solutions

### 1. MongoDB Connection Issues

**Problem**: "MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017"

**Solutions**:
- Check if MongoDB is running:
  ```bash
  # Windows
  Check Services app for "MongoDB"

  # macOS
  brew services list

  # Linux
  sudo systemctl status mongod
  ```
- Start MongoDB if it's not running
- Check if the port 27017 is available

### 2. Port Already in Use

**Problem**: "Something is already running on port 3000/8080"

**Solutions**:
- Find the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000

  # macOS/Linux
  lsof -i :3000
  ```
- Stop the process:
  ```bash
  # Windows
  taskkill /PID <process_id> /F

  # macOS/Linux
  kill <process_id>
  ```
- Or use a different port by modifying the `.env` files

### 3. Node.js Version Issues

**Problem**: "Unsupported engine" warnings

**Solution**: Install the correct Node.js version:
```bash
# Using nvm (Node Version Manager)
nvm install 16
nvm use 16
```

### 4. Missing Dependencies

**Problem**: "Module not found" errors

**Solution**: Reinstall dependencies:
```bash
# In the server directory
rm -rf node_modules package-lock.json
npm install

# In the client directory
rm -rf node_modules package-lock.json
npm install
```

### 5. React App Not Loading

**Problem**: White screen or "You need to enable JavaScript" message

**Solutions**:
1. **Check JavaScript Settings**
   - Ensure JavaScript is enabled in your browser:
     - Chrome: Settings → Privacy and Security → Site Settings → JavaScript
     - Firefox: about:preferences → Privacy & Security → Permissions → JavaScript
     - Safari: Preferences → Security → Enable JavaScript
     - Edge: Settings → Cookies and site permissions → JavaScript

2. **Clear Browser Cache**
   - Windows/Linux: Ctrl + Shift + Delete
   - macOS: Cmd + Shift + Delete
   - Select "Cached images and files"
   - Click "Clear data"

3. **Development Server Issues**
   - Stop the development server (Ctrl/Cmd + C)
   - Clear the build cache:
     ```bash
     # In the client directory
     rm -rf node_modules/.cache
     ```
   - Restart the development server:
     ```bash
     npm start
     ```

4. **Check React Mounting**
   - Ensure `index.html` has the correct root element:
     ```html
     <div id="root"></div>
     ```
   - Verify `index.js` has the correct mounting code:
     ```javascript
     import { createRoot } from 'react-dom/client';
     const root = createRoot(document.getElementById('root'));
     root.render(<App />);
     ```

5. **Browser Compatibility**
   - Try a different browser
   - Update your current browser to the latest version
   - Disable browser extensions temporarily

6. **Development Environment**
   - Check Node.js version:
     ```bash
     node --version
     ```
   - Should be v16 or higher
   - If not, update Node.js:
     ```bash
     # Using nvm
     nvm install 16
     nvm use 16
     ```

7. **Project Dependencies**
   - Clean install dependencies:
     ```bash
     # In the client directory
     rm -rf node_modules package-lock.json
     npm install
     ```
   - Check for missing dependencies:
     ```bash
     npm ls react react-dom
     ```

8. **Development Tools**
   - Open browser developer tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests
   - Check Application tab for service worker issues

If none of these solutions work:
1. Create a new React app and copy over your components:
   ```bash
   npx create-react-app temp-app
   cp -r client/src/* temp-app/src/
   cd temp-app
   npm install
   npm start
   ```
2. If the new app works, compare configurations
3. If the new app doesn't work, check your system's Node.js installation

## Development Workflow

1. **Starting Development**
   - Start MongoDB
   - Start the backend server
   - Start the frontend client
   - Make changes to the code
   - See changes in real-time

2. **Testing Changes**
   - Frontend changes are automatically reflected
   - Backend changes require server restart
   - Check browser console for errors
   - Test all features after changes

3. **Debugging**
   - Use browser developer tools
   - Check server console for errors
   - Use MongoDB Compass for database inspection
   - Check network requests in browser

## Security Considerations

- Never commit `.env` files
- Use strong JWT secrets in production
- Keep dependencies updated
- Follow security best practices
- Regularly audit the code

## Getting Help

If you encounter issues:
1. Check the Common Issues section
2. Search the project issues
3. Check the documentation
4. Contact the maintainers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

GPL-3.0 license

## Testing

The project uses Jest as the testing framework with separate configurations for client, server, and circuit tests. All tests are located in the `/test` directory, organized by component.

### Prerequisites

Before running tests, ensure you have installed all dependencies:

```bash
# Install root-level dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Running Tests

You can run tests in several ways:

1. **Run all tests**:
   ```bash
   npm test
   ```

2. **Run specific component tests**:
   ```bash
   # Run only client tests
   npm run test:client

   # Run only server tests
   npm run test:server

   # Run only circuit tests
   npm run test:circuits
   ```

3. **Run tests in watch mode** (useful during development):
   ```bash
   npm run test:watch
   ```

4. **Generate coverage report**:
   ```bash
   npm run test:coverage
   ```

### Test Structure

The test directory is organized as follows:

```
/test
├── client/         # Client-side tests (React components, hooks, etc.)
├── server/         # Server-side tests (API endpoints, database operations)
└── circuits/       # Circuit tests (zero-knowledge proof circuits)
```

### Writing Tests

1. **Client Tests**:
   - Use React Testing Library for component tests
   - Test files should be named `*.test.js` or `*.test.jsx`
   - Place tests in `/test/client/` directory
   - Example: `test/client/Login.test.js`

2. **Server Tests**:
   - Use Jest with Node environment
   - Test files should be named `*.test.js`
   - Place tests in `/test/server/` directory
   - MongoDB is automatically mocked using `mongodb-memory-server`

3. **Circuit Tests**:
   - Use Jest with Node environment
   - Test files should be named `*.test.js`
   - Place tests in `/test/circuits/` directory
   - Helper functions for circuit testing are available in `setup.js`

### Test Coverage

The project is configured to collect coverage information for:
- Client-side code in `client/src/`
- Server-side code in `server/src/`
- Circuit code in `circuits/`

To view the coverage report:
1. Run `npm run test:coverage`
2. Open `coverage/lcov-report/index.html` in your browser

### Troubleshooting Tests

1. **Client Tests Failing**:
   - Ensure all required dependencies are installed
   - Check that the component's dependencies are properly mocked
   - Verify that the test environment is properly configured

2. **Server Tests Failing**:
   - Check MongoDB connection settings
   - Verify that the test database is properly initialized
   - Ensure all required environment variables are set

3. **Circuit Tests Failing**:
   - Verify that circuit files (.wasm and .zkey) are present
   - Check that the circuit paths in tests are correct
   - Ensure snarkjs is properly configured

### Backend API Testing with Vitest

The backend uses Vitest for API testing, which provides:
- Fast test execution
- Native ESM support
- Built-in TypeScript support
- Watch mode with UI
- Coverage reporting

#### Running Backend Tests

```bash
# Navigate to server directory
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Writing Backend Tests

1. **Test Structure**:
   - Tests are located in `server/test/`
   - API tests are in `server/test/api/`
   - Each test file should be named `*.test.js`

2. **Test Setup**:
   - MongoDB is automatically mocked using `mongodb-memory-server`
   - Database is cleared between tests
   - Test environment is configured in `vitest.config.js`

3. **Example Test**:
   ```javascript
   import { describe, it, expect } from 'vitest';
   import request from 'supertest';
   import app from '../../src/app';

   describe('API Endpoint', () => {
     it('should handle request correctly', async () => {
       const response = await request(app)
         .post('/api/endpoint')
         .send({ data: 'test' });

       expect(response.status).toBe(200);
       expect(response.body).toHaveProperty('data');
     });
   });
   ```

4. **Best Practices**:
   - Use `beforeEach` to set up test data
   - Use `afterEach` to clean up test data
   - Test both success and error cases
   - Mock external services when necessary
   - Use descriptive test names

### Circuit Testing

The project uses Vitest for testing zero-knowledge proof circuits. Circuit tests verify the correctness and privacy properties of the zero-knowledge proofs.

#### Running Circuit Tests

```bash
# Navigate to circuits directory
cd circuits

# Run all circuit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Circuit Test Structure

1. **Test Setup** (`test/setup.js`):
   - Helper functions for loading circuits
   - Proof generation and verification utilities
   - Field element conversion utilities

2. **Test Categories**:
   - Valid proof generation and verification
   - Invalid input handling
   - Privacy property verification
   - Edge case handling

3. **Example Test Cases**:
   ```javascript
   describe('Income Verification Circuit', () => {
     it('should generate and verify proof for income above threshold', async () => {
       const input = {
         income: toFieldElement(5000),
         threshold: toFieldElement(3000),
         salt: toFieldElement(12345)
       };

       const { proof, publicSignals } = await generateProof(circuit, input);
       const isValid = await verifyProof(circuit, proof, publicSignals);

       expect(isValid).toBe(true);
       expect(publicSignals[0]).toBe('1');
     });
   });
   ```

#### Testing Best Practices

1. **Privacy Testing**:
   - Verify that private inputs remain hidden
   - Check that only necessary information is revealed
   - Test with different salt values

2. **Input Validation**:
   - Test with valid inputs
   - Test with invalid inputs
   - Test edge cases and boundary conditions

3. **Proof Verification**:
   - Verify proof generation
   - Verify proof validation
   - Test with tampered proofs

4. **Performance Testing**:
   - Test with large input values
   - Test with complex circuit logic
   - Monitor proof generation time

#### Troubleshooting Circuit Tests

1. **Circuit Loading Issues**:
   - Verify circuit files exist (.wasm, .zkey)
   - Check file paths in test setup
   - Ensure correct circuit compilation

2. **Proof Generation Failures**:
   - Check input format and range
   - Verify circuit constraints
   - Check for field element conversion issues

3. **Verification Failures**:
   - Verify verification key
   - Check public signals format
   - Ensure correct proof structure

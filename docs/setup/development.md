# Development Environment Setup

This guide will help you set up your development environment for the Rental ZKP project.

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

2. **MongoDB**
   - Windows: Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - macOS: Install using Homebrew: `brew install mongodb-community`
   - Linux: Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Git**
   - Windows: Download and install from [git-scm.com](https://git-scm.com/download/win)
   - macOS: Install using Homebrew: `brew install git`
   - Linux: `sudo apt install git`

## Project Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
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

3. **Environment Setup**

   Create `.env` files in both client and server directories:

   ```bash
   # server/.env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/rental-zkp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development

   # client/.env
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Start MongoDB**
   - Windows: MongoDB should run as a service
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

5. **Start Development Servers**
   ```bash
   # From the root directory
   npm start
   ```

## Development Workflow

1. **Starting Development**
   - The `npm start` command will start both client and server
   - Client runs on http://localhost:3000
   - Server runs on http://localhost:8080

2. **Making Changes**
   - Frontend changes are hot-reloaded
   - Backend changes require server restart
   - Use `npm run dev` in the server directory for auto-restart

3. **Testing**
   - Run tests with `npm test`
   - Run specific test suites:
     ```bash
     npm run test:client
     npm run test:server
     npm run test:circuits
     ```

4. **Code Quality**
   - Run linter: `npm run lint`
   - Format code: `npm run format`

## Common Issues

### MongoDB Connection Issues

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

### Port Already in Use

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

### Node.js Version Issues

**Problem**: "Unsupported engine" warnings

**Solution**: Install the correct Node.js version:
```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18
```

## Next Steps

- Read the [API Documentation](api/README.md)
- Learn about [Circuit Development](circuits/development.md)
- Check the [Architecture Overview](architecture/overview.md) 
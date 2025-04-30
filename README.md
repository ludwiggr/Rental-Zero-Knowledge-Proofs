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
   - Windows: Download and install from [nodejs.org](https://nodejs.org/)
   - macOS: Install using Homebrew: `brew install node`
   - Linux: `sudo apt install nodejs npm`

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

MIT

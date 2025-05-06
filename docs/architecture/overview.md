# Architecture Overview

## System Architecture

The Rental ZKP system follows a modern microservices architecture with the following components:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │    API      │     │  Circuits   │
│  (React)    │◄────┤  (Fastify)  │◄────┤  (Circom)   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MongoDB   │     │   Redis     │     │  FileStore  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Component Details

### 1. Client (Frontend)
- **Technology**: React.js with Material-UI
- **Key Features**:
  - Responsive design
  - Real-time updates via WebSocket
  - Client-side proof generation
  - Secure credential management

### 2. API (Backend)
- **Technology**: Fastify.js
- **Key Features**:
  - RESTful API endpoints
  - WebSocket support
  - JWT authentication
  - Rate limiting
  - Input validation with Zod

### 3. Circuits (Zero-Knowledge Proofs)
- **Technology**: Circom 2.0
- **Key Features**:
  - Income verification
  - Rental history verification
  - Credit score verification
  - Secure proof generation and verification

### 4. Data Storage
- **MongoDB**:
  - User profiles
  - Property listings
  - Application data
  - Proof metadata
- **Redis**:
  - Session management
  - Rate limiting
  - Caching
- **FileStore**:
  - Circuit artifacts
  - Proof files
  - Verification keys

## Data Flow

1. **User Registration/Login**
   ```
   User → Client → API → MongoDB
   ```

2. **Proof Generation**
   ```
   User → Client → Circuits → FileStore
   ```

3. **Property Application**
   ```
   User → Client → API → MongoDB
   ```

4. **Proof Verification**
   ```
   API → Circuits → FileStore → API
   ```

## Security Architecture

### 1. Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Session management with Redis
- Rate limiting per user/IP

### 2. Data Protection
- Zero-knowledge proofs for sensitive data
- Encrypted data storage
- Secure key management
- Input sanitization

### 3. API Security
- CORS configuration
- Rate limiting
- Request validation
- Error handling

## Deployment Architecture

### Development
```
┌─────────────┐     ┌─────────────┐
│   Client    │     │    API      │
│  (3000)     │◄────┤  (8080)     │
└─────────────┘     └─────────────┘
```

### Production
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │     │   API       │     │  MongoDB    │
│  (443)      │◄────┤  (8080)     │◄────┤  (27017)    │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Redis     │     │  Circuits   │     │  FileStore  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Scaling Strategy

### 1. Horizontal Scaling
- Stateless API servers
- Load balancing with Nginx
- MongoDB replica sets
- Redis cluster

### 2. Performance Optimization
- Circuit compilation caching
- Proof verification caching
- Database indexing
- API response caching

### 3. Monitoring
- Application metrics
- Circuit performance
- Database performance
- API response times

## Development Workflow

1. **Local Development**
   - Docker Compose for services
   - Hot reloading
   - Local MongoDB
   - Circuit development environment

2. **Testing**
   - Unit tests
   - Integration tests
   - Circuit tests
   - End-to-end tests

3. **CI/CD**
   - GitHub Actions
   - Automated testing
   - Docker builds
   - Deployment automation

## Future Considerations

1. **Scalability**
   - Circuit optimization
   - Database sharding
   - Caching strategies
   - Load balancing

2. **Features**
   - Additional proof types
   - Mobile applications
   - Blockchain integration
   - Smart contract verification

3. **Security**
   - Advanced encryption
   - Multi-factor authentication
   - Audit logging
   - Security monitoring 
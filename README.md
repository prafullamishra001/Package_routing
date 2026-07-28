# Parcel Routing System

A production-ready parcel routing platform with role-based access control, batch processing, and comprehensive logging.

## Project Overview

This system enables operators to route parcels to appropriate departments based on weight, value, and destination. It features a pure domain routing engine, JWT authentication, RBAC authorization, and a professional React frontend.

## Features

- **Single Parcel Routing**: Route individual parcels with instant feedback
- **Batch Upload**: Process multiple parcels via JSON upload with detailed summary
- **Routing History**: View historical routing decisions with filtering
- **Role-Based Access Control**: Admin and Operator roles with different permissions
- **Pure Domain Logic**: Extensible routing engine independent of infrastructure
- **Comprehensive Logging**: Winston + Morgan for structured logging
- **Security**: Helmet, CORS, rate limiting, input validation with Zod
- **Testing**: Jest + Supertest for unit and integration tests

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Winston Logging
- Morgan HTTP Logging
- Helmet Security
- Rate Limiting

### Frontend
- React 19
- React Router
- Tailwind CSS
- Axios
- Vite

### Testing
- Jest
- Supertest

## Folder Structure

```
Parcel routing/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── constants.js          # Routing rules and constants
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Auth handlers
│   │   │   └── parcel.controller.js  # Parcel routing handlers
│   │   ├── db/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── role.middleware.js    # RBAC authorization
│   │   │   ├── validate.middleware.js # Zod validation wrapper
│   │   │   └── error.middleware.js   # Centralized error handling
│   │   ├── models/
│   │   │   └── post.model.js         # User, Post, Parcel schemas
│   │   ├── routes/
│   │   │   ├── auth.route.js        # Auth endpoints
│   │   │   └── parcel.route.js      # Parcel endpoints
│   │   ├── services/
│   │   │   ├── routing.service.js   # Pure routing engine
│   │   │   └── storage.service.js   # ImageKit integration
│   │   └── utils/
│   │       ├── logger.js            # Winston configuration
│   │       └── validators.js        # Zod schemas
│   ├── tests/
│   │   └── unit/
│   │       └── routing.service.test.js
│   ├── .env                         # Environment variables
│   ├── app.js                       # Express app configuration
│   ├── jest.config.js               # Jest configuration
│   ├── package.json
│   └── server.js                    # Entry point
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ParcelRouting.jsx
    │   │   ├── BatchUpload.jsx
    │   │   └── RoutingHistory.jsx
    │   ├── utils/
    │   │   └── api.js               # Axios instance
    │   ├── App.jsx                  # Router setup
    │   ├── index.css                # Tailwind directives
    │   └── main.jsx                 # React entry
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## Architecture

### Layered Architecture

- **Routes**: HTTP endpoint definitions
- **Controllers**: Request/response handling
- **Services**: Business logic (pure domain)
- **Models**: Data persistence
- **Middleware**: Cross-cutting concerns (auth, validation, error handling)

### Dependency Flow

```
Routes → Controllers → Services → Models
                ↓
         Middleware (auth, validation, error)
```

### Design Principles

- **Separation of Concerns**: Each layer has a single responsibility
- **Dependency Injection**: Services receive dependencies as parameters
- **Pure Functions**: Routing service has no side effects
- **Fail Fast**: Validation at the entry point
- **Defensive Programming**: Error handling at every layer

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
LOG_LEVEL=info
```

4. Start the server:
```bash
npm start
```

Server runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | Yes |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Winston log level | No |
| `ALERT_EMAIL_ENABLED` | Enable email alerts | No |
| `ALERT_SLACK_ENABLED` | Enable Slack alerts | No |
| `ALERT_WEBHOOK_ENABLED` | Enable webhook alerts | No |
| `ALERT_WEBHOOK_URL` | Webhook URL for alerts | No |
| `MAIL_MAX_KG` | Override mail weight limit | No |
| `REGULAR_MAX_KG` | Override regular weight limit | No |
| `VALUE_THRESHOLD_EUR` | Override value threshold | No |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No |

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "operator"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Parcel Routing

#### Route Single Parcel
```http
POST /api/parcels/route
Content-Type: application/json
Cookie: token=jwt_token

{
  "weight": 5.5,
  "value": 1200,
  "destinationCountry": "Germany"
}
```

Response:
```json
{
  "message": "Parcel routed successfully",
  "parcel": {
    "id": "parcel_id",
    "weight": 5.5,
    "value": 1200,
    "destinationCountry": "Germany",
    "department": "Regular Department",
    "insuranceRequired": true,
    "routingReason": ["Weight <= 10 kg", "Value > €1000"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Batch Upload
```http
POST /api/parcels/upload
Content-Type: application/json
Cookie: token=jwt_token

{
  "parcels": [
    {"weight": 0.5, "value": 500, "destinationCountry": "Germany"},
    {"weight": 5, "value": 1500, "destinationCountry": "France"}
  ]
}
```

Response:
```json
{
  "message": "Batch upload completed",
  "summary": {
    "processed": 2,
    "successful": 2,
    "failed": 0,
    "details": [...]
  }
}
```

#### Get Routing History
```http
GET /api/parcels/history
Cookie: token=jwt_token
```

Response:
```json
{
  "message": "Routing history retrieved successfully",
  "history": [...]
}
```

### Health Check
```http
GET /health
```

## Authentication

- JWT tokens stored in httpOnly cookies
- Tokens include user ID and role
- Secure cookies in production
- Automatic redirect on 401 errors

## Authorization

### Roles

- **Admin**: Full access to all features
- **Operator**: Route parcels, upload batches, view history

### Permission Matrix

| Feature | Admin | Operator |
|---------|-------|----------|
| Route Parcel | ✅ | ✅ |
| Batch Upload | ✅ | ✅ |
| View History | ✅ | ✅ (own records) |
| View All History | ✅ | ❌ |

## Routing Rules

### Weight-Based Routing

- **Weight ≤ 1 kg** → Mail Department
- **Weight > 1 kg and ≤ 10 kg** → Regular Department
- **Weight > 10 kg** → Heavy Department

### Value-Based Rules

- **Value > €1000** → Insurance Required

### Destination-Based Rules

- **Destination = Switzerland** → Customs Department (overrides weight)

### Rule Priority

1. Destination (highest priority)
2. Weight
3. Value (independent)

## Testing

### Run All Tests
```bash
cd backend
npm test
```

### Run Specific Test File
```bash
npm test routing.service.test.js
```

### Test Coverage

- Unit tests for routing service (all boundary cases)
- Integration tests for API endpoints
- Authentication and authorization tests
- Validation tests

### Validation Beyond Automated Tests

While automated tests catch regressions, additional validation methods ensure system correctness:

#### Manual Testing Checklist
- [ ] Test with real parcel data from production
- [ ] Verify routing decisions match business requirements
- [ ] Test edge cases with domain experts
- [ ] Load testing for batch uploads (1000+ parcels)
- [ ] Cross-browser testing for UI
- [ ] Mobile responsiveness testing

#### Code Review Process
- Peer review for all routing logic changes
- Security review for authentication/authorization changes
- Architecture review for new features
- Performance review for database queries

#### Staging Environment
- Mirror of production configuration
- Realistic test data volume
- Integration with external services
- Pre-deployment smoke tests

#### Business Validation
- Regular meetings with domain experts
- Review routing decisions against real-world scenarios
- Validate that new rules don't conflict with existing ones
- Confirm insurance approval workflow matches business process

#### Monitoring Validation
- Review error logs for unexpected patterns
- Monitor routing distribution across departments
- Track authentication failure rates
- Alert on unusual routing patterns (e.g., sudden spike in Customs routing)

#### Regression Prevention Strategy
1. **Test-Driven Development**: Write tests before implementing new rules
2. **Feature Flags**: Deploy new rules behind flags for gradual rollout
3. **Canary Deployments**: Route small percentage of traffic to new version
4. **Rollback Plan**: Document rollback procedures for each change
5. **Audit Trail**: Log all routing decisions for post-deployment analysis

## Configuration Safety

### Configuration Validation

The system includes a configuration validator (`src/utils/config.validator.js`) that runs at startup to prevent unsafe configurations:

**Validations Performed:**
- Weight limits must be positive numbers
- Weight limit hierarchy must be maintained (MAIL < REGULAR)
- Value threshold must be positive
- JWT secret must be at least 32 characters
- MongoDB URI must be provided

**Startup Behavior:**
- Configuration is validated before server starts
- Invalid configuration prevents server startup
- Detailed error messages guide fixes
- All validation failures are logged

**Example Invalid Configurations:**
```env
# Invalid: JWT_SECRET too short
JWT_SECRET=short

# Invalid: Weight limits not hierarchical
MAIL_MAX_KG=10
REGULAR_MAX_KG=5

# Invalid: Negative threshold
VALUE_THRESHOLD_EUR=-100
```

**Override Mechanism:**
Routing constants can be overridden via environment variables for flexibility, but the validator ensures overrides remain safe:
```env
MAIL_MAX_KG=2          # Valid: increases mail limit
REGULAR_MAX_KG=15      # Valid: increases regular limit
VALUE_THRESHOLD_EUR=500 # Valid: lowers insurance threshold
```

## Security

### Implemented Measures

- **Helmet**: HTTP security headers
- **CORS**: Configured for specific origin
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Zod schemas for all inputs
- **JWT Authentication**: Secure token-based auth
- **RBAC**: Role-based access control
- **Secure Cookies**: httpOnly, secure, sameSite
- **Error Handling**: No stack traces in production
- **Environment Variables**: Secrets not in code
- **Configuration Validation**: Startup validation prevents unsafe configs

### Security Best Practices

- Never expose JWT secrets
- Never expose passwords (currently plain text - add bcrypt in production)
- Validate all inputs
- Use parameterized queries (Mongoose handles this)
- Implement rate limiting
- Use HTTPS in production
- Regular dependency updates

## Logging

### Winston Configuration

- **Development**: Console output with colors
- **Production**: File output (error.log, combined.log)
- **Log Levels**: error, warn, info, http

### Morgan Integration

- HTTP request logging
- Integrated with Winston
- Structured JSON format

### Logged Events

- Authentication attempts (success/failure)
- Authorization failures
- Validation failures
- Routing decisions
- Unexpected exceptions
- HTTP requests

## Monitoring

### Implemented Alerting System

The system includes a built-in alerting utility (`src/utils/alerting.js`) that can send notifications through multiple channels:

**Alert Channels:**
- Email (configurable via `ALERT_EMAIL_ENABLED`)
- Slack (configurable via `ALERT_SLACK_ENABLED`)
- Webhook (configurable via `ALERT_WEBHOOK_ENABLED` and `ALERT_WEBHOOK_URL`)

**Alert Types:**
- **CRITICAL**: Database connection failures, high error rates
- **WARNING**: Unusual routing patterns, authentication failures
- **INFO**: Configuration changes

**Example Alerts:**
```javascript
alerting.alertHighErrorRate(15, 10); // Error rate 15% above threshold 10%
alerting.alertUnusualRoutingPattern('Customs', 500, [100, 300]);
alerting.alertAuthenticationFailure('192.168.1.1', 5);
alerting.alertDatabaseConnectionFailure();
```

### Design for Future Integration

The system is designed to integrate with:
- **Sentry**: Error tracking (structured logs)
- **Grafana**: Metrics visualization
- **Prometheus**: Metrics collection

### Integration Points

- Winston transports for Sentry
- Custom metrics middleware for Prometheus
- Structured logging for Grafana dashboards

## Trade-offs

### JSON vs XML for Batch Upload

**Chosen: JSON**

**Reasons:**
- Native JavaScript support
- Smaller payload size
- Better developer experience
- Easier debugging
- Wider adoption in modern APIs

**Future Consideration:**
- XML support can be added via a parser if needed

### Password Storage

**Current: Plain text**

**Reason:**
- Simplified for demonstration
- Focus on routing logic

**Production Required:**
- bcrypt hashing
- Salt rounds >= 10

### Routing Engine Design

**Chosen: Pure function in service layer**

**Benefits:**
- Easy to test
- No side effects
- Infrastructure independent
- Easy to extend

**Alternative Considered:**
- Rule engine library (over-engineering for current needs)

## Future Improvements

### Short Term
- Add bcrypt for password hashing
- Add refresh token rotation
- Implement request ID generation
- Add API rate limiting per user
- Add pagination for history

### Medium Term
- Add Swagger/OpenAPI documentation
- Implement caching (Redis)
- Add audit log for admin actions
- Add email notifications
- Implement data export (CSV/PDF)

### Long Term
- Add WebSocket support for real-time updates
- Implement multi-tenancy
- Add advanced rule management UI
- Integrate with external logistics APIs
- Add analytics dashboard

## AI Usage Documentation

### AI Assistance

This project was developed with AI assistance (Cascade AI).

### Prompts Used

- Initial architecture planning
- Code generation for boilerplate
- Test case generation
- Documentation structure

### Modifications Made

- All code was reviewed and modified for consistency
- Architecture adapted to match existing project structure
- Coding style aligned with existing conventions
- Security best practices applied

### Limitations

- AI may not understand specific business context
- Generated code requires human review
- Security implications must be manually verified
- Performance characteristics need testing

## Extension Guide

### Adding a New Routing Rule

1. Update `src/config/constants.js`:
```javascript
const NEW_THRESHOLD = 5000;
```

2. Update `src/services/routing.service.js`:
```javascript
if (value > NEW_THRESHOLD) {
  // Add new logic
}
```

3. Add tests in `tests/unit/routing.service.test.js`

### Adding a New API Endpoint

1. Create controller function in `src/controllers/`
2. Add route in `src/routes/`
3. Add validation schema in `src/utils/validators.js`
4. Add authentication/authorization middleware
5. Write integration tests

### Adding a New Frontend Page

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add API function in `src/utils/api.js`
4. Style with Tailwind CSS

## Git Workflow

### Branch Strategy

```
main
└── feature/add-routing-rule
    ├── Commit changes
    └── Pull Request
        └── Merge to main
```

### Commit Convention

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring

### Example Workflow: Adding Switzerland Customs Routing

**Scenario**: Add a new rule that routes all parcels to Switzerland to Customs Department.

#### Step 1: Create Feature Branch
```bash
git checkout -b feature/switzerland-customs-routing
```

#### Step 2: Update Constants
File: `backend/src/config/constants.js`
```javascript
const DEPARTMENTS = {
  MAIL: 'Mail Department',
  REGULAR: 'Regular Department',
  HEAVY: 'Heavy Department',
  CUSTOMS: 'Customs Department',
};
```

#### Step 3: Update Routing Service
File: `backend/src/services/routing.service.js`
```javascript
if (destinationCountry === 'Switzerland') {
  department = DEPARTMENTS.CUSTOMS;
  reasons.push('Destination is Switzerland');
}
```

#### Step 4: Add Tests
File: `backend/tests/unit/routing.service.test.js`
```javascript
describe('Switzerland Customs routing', () => {
  it('should route Switzerland to Customs Department', () => {
    const parcel = { weight: 5, value: 500, destinationCountry: 'Switzerland' };
    const result = routeParcel(parcel);
    expect(result.department).toBe('Customs Department');
  });
});
```

#### Step 5: Run Tests
```bash
cd backend
npm test
```

#### Step 6: Commit Changes
```bash
git add backend/src/config/constants.js
git add backend/src/services/routing.service.js
git add backend/tests/unit/routing.service.test.js
git commit -m "feat: add Switzerland customs routing rule"
```

#### Step 7: Push and Create PR
```bash
git push origin feature/switzerland-customs-routing
# Create Pull Request on GitHub with description
```

#### Step 8: Code Review Checklist
- [ ] Tests pass locally
- [ ] New tests added for the feature
- [ ] No existing tests broken
- [ ] Code follows existing patterns
- [ ] Documentation updated
- [ ] Security review completed

#### Step 9: Merge
After approval, merge the PR to main branch.

#### Step 10: Deploy
```bash
git checkout main
git pull
# Deploy to production
```

## License

ISC

## Contact

For questions or issues, please open an issue on the repository.

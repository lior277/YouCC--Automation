# Buggy Cars Rating - Playwright Automation Framework

## Overview
A modern automation testing framework for the Buggy Cars Rating website built with Playwright and TypeScript, featuring clean architecture and reliable test patterns.

## Features
- **Page Object Model (POM)** - Clean, maintainable page abstractions
- **TypeScript** - Full type safety and IntelliSense support
- **API Testing** - Comprehensive API validation with authentication
- **Hybrid Testing** - Combined API + UI verification
- **Smart Fixtures** - Reusable authentication and data management
- **Parallel Execution** - Fast test runs with isolated test data
- **Multiple Reporters** - HTML reports and JUnit XML output

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/lior277/buggy-cars-automation.git
cd buggy-cars-automation
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Run Tests
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:api          # API tests only
npm run test:ui           # UI tests only
npm run test:hybrid       # Hybrid tests only
```

## Project Structure
```
tests/
├── api/                  # API test suite
├── ui/                   # UI test suite
├── hybrid/               # API + UI verification tests
├── fixtures/             # Test fixtures and utilities
└── pages/                # Page Object Models

config/
└── config.ts            # Environment configuration

utils/
└── helpers/             # Test utilities and helpers
```

## Test Types

### API Tests
- **Profile Management** - User profile CRUD operations
- **Authentication** - Login/registration flows
- **Data Validation** - Response structure and content verification

### UI Tests
- **User Registration** - End-to-end registration flows
- **Profile Management** - UI-based profile operations
- **Navigation** - Page interactions and workflows

### Hybrid Tests
- **API + UI Verification** - Modify data via API, verify in UI
- **Cross-validation** - Ensure API changes reflect in the interface

## Key Features

### Smart Authentication
- **Fresh user creation** for each test run
- **Automatic token management** for API tests
- **Session handling** for UI tests

### Reliable Test Data
- **Random data generation** for test isolation
- **Cleanup mechanisms** to prevent test interference
- **Reusable fixtures** for consistent data patterns

### Modern Architecture
- **TypeScript path mapping** for clean imports
- **Nullish coalescing** for safe data handling
- **Clean error handling** and debugging

## Configuration
Environment settings are managed in `config/config.ts`:
- API base URLs
- UI base URLs  
- Test timeouts
- Browser settings

## Reporting
- **HTML Report** - Interactive test results with screenshots
- **JUnit XML** - CI/CD integration support
- **Console Output** - Real-time test progress

## Best Practices
- Each test creates fresh user data for isolation
- API tests run headless for speed
- UI tests run with browser for visual verification
- Fixtures handle authentication and data setup
- Page objects abstract UI interactions

## Contributing
1. Follow the existing code patterns
2. Use TypeScript for all new code
3. Add appropriate tests for new features
4. Update documentation as needed

## License
ISC

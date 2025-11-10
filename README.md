# OneHourStudy - Next.js with Tailwind CSS

A modern, responsive website for connecting students with expert tutors, built with Next.js and Tailwind CSS.

## Features

- ✅ Modern UI with Tailwind CSS
- ✅ Fully responsive design
- ✅ Form validation
- ✅ localStorage integration
- ✅ Success modals
- ✅ Smooth animations
- ✅ TypeScript support
- ✅ Unit testing with Jest and React Testing Library
- ✅ End-to-end testing with Puppeteer

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode (useful during development):

```bash
npm run test:watch
```

Run tests with coverage report:

```bash
npm run test:coverage
```

### Running E2E Tests

**Important:** Make sure your development server is running before running E2E tests:

```bash
# Terminal 1: Start the dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e
```

Run E2E tests in watch mode:

```bash
npm run test:e2e:watch
```

Run E2E tests with visible browser (headed mode):

```bash
npm run test:e2e:headed
```

## Project Structure

```
├── components/          # Reusable React components
│   ├── Navbar.tsx       # Navigation component
│   ├── Footer.tsx       # Footer component
│   └── SuccessModal.tsx # Success modal component
├── pages/               # Next.js pages
│   ├── _app.tsx        # App configuration
│   ├── index.tsx       # Home page
│   ├── student-register.tsx
│   ├── teacher-register.tsx
│   ├── pricing.tsx
│   └── contact.tsx
├── lib/                 # Utility functions
│   ├── utils.ts        # Validation and localStorage helpers
│   └── __tests__/      # Unit tests for utilities
├── components/          # Reusable React components
│   └── __tests__/      # Unit tests for components
├── styles/              # Global styles
│   └── globals.css    # Tailwind CSS imports
├── e2e/                  # End-to-end tests
│   ├── home.e2e.test.ts
│   ├── student-register.e2e.test.ts
│   ├── teacher-register.e2e.test.ts
│   ├── login.e2e.test.ts
│   ├── navigation.e2e.test.ts
│   └── contact.e2e.test.ts
├── jest.config.js       # Jest configuration for unit tests
├── jest.e2e.config.js   # Jest configuration for E2E tests
├── jest-puppeteer.config.js # Puppeteer configuration
├── jest.setup.js        # Jest setup file
├── jest.e2e.setup.js    # E2E test setup file
├── tailwind.config.js  # Tailwind configuration
├── next.config.js      # Next.js configuration
└── package.json        # Dependencies
```

## Pages

- **Home** (`/`) - Landing page with hero, about, features, testimonials, and CTA
- **Student Register** (`/student-register`) - Student registration form
- **Teacher Register** (`/teacher-register`) - Teacher registration form
- **Pricing** (`/pricing`) - Pricing plans for students and teachers
- **Contact** (`/contact`) - Contact form and information

## Technologies Used

- **Next.js 14** - React framework
- **Tailwind CSS 3** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Font Awesome** - Icons
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **Puppeteer** - End-to-end testing with headless Chrome
- **jest-puppeteer** - Jest preset for Puppeteer

## Features Implemented

- Form validation with real-time error messages
- localStorage for saving registration data
- Responsive navigation with mobile menu
- Success modals with animations
- Gradient designs and modern UI
- Smooth scroll and hover effects
- Comprehensive unit tests for components and utilities
- End-to-end tests for user flows (registration, login, navigation)

## Testing

This project includes both unit tests and end-to-end (E2E) tests.

### Unit Tests

Unit tests are located in `__tests__` directories next to the files they test.

#### Test Structure

- **Component Tests** (`components/__tests__/`) - Tests for React components
- **Utility Tests** (`lib/__tests__/`) - Tests for utility functions
- **Page Tests** (`pages/__tests__/`) - Tests for Next.js pages

#### Writing Unit Tests

Create test files with the pattern `*.test.tsx` or `*.test.ts` in `__tests__` directories. Example:

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### End-to-End (E2E) Tests

E2E tests use Puppeteer to test the application in a real browser environment. Tests are located in the `e2e/` directory.

#### E2E Test Structure

- **Home Page Tests** (`e2e/home.e2e.test.ts`) - Tests for homepage functionality
- **Student Registration Tests** (`e2e/student-register.e2e.test.ts`) - Tests for student registration flow
- **Teacher Registration Tests** (`e2e/teacher-register.e2e.test.ts`) - Tests for teacher registration flow
- **Login Tests** (`e2e/login.e2e.test.ts`) - Tests for login functionality
- **Navigation Tests** (`e2e/navigation.e2e.test.ts`) - Tests for navigation between pages
- **Contact Tests** (`e2e/contact.e2e.test.ts`) - Tests for contact form

#### Writing E2E Tests

Create test files with the pattern `*.e2e.test.ts` in the `e2e/` directory. Example:

```typescript
describe('My Page E2E Tests', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/my-page', { waitUntil: 'networkidle0' })
  })

  it('should load the page successfully', async () => {
    await expect(page).toHaveURL('http://localhost:3000/my-page')
    const pageTitle = await page.textContent('h1')
    expect(pageTitle).toContain('My Page')
  })
})
```

#### E2E Test Configuration

- **jest.e2e.config.js** - Jest configuration for E2E tests
- **jest-puppeteer.config.js** - Puppeteer browser configuration
- **jest.e2e.setup.js** - Setup file for E2E tests

#### Running E2E Tests

**Prerequisites:** The development server must be running on `http://localhost:3000`

1. Start the development server in one terminal:
   ```bash
   npm run dev
   ```

2. Run E2E tests in another terminal:
   ```bash
   npm run test:e2e
   ```

For debugging, run tests with visible browser:
```bash
npm run test:e2e:headed
```

## Customization

The color scheme and design can be customized in:
- `tailwind.config.js` - Colors and gradients
- `styles/globals.css` - Custom animations and utilities

## License

© 2025 OneHourStudy. All rights reserved.


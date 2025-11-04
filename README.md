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
│   └── utils.ts        # Validation and localStorage helpers
├── styles/              # Global styles
│   └── globals.css    # Tailwind CSS imports
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

## Features Implemented

- Form validation with real-time error messages
- localStorage for saving registration data
- Responsive navigation with mobile menu
- Success modals with animations
- Gradient designs and modern UI
- Smooth scroll and hover effects

## Customization

The color scheme and design can be customized in:
- `tailwind.config.js` - Colors and gradients
- `styles/globals.css` - Custom animations and utilities

## License

© 2025 OneHourStudy. All rights reserved.


# QASA Platform - Web Application

## TL;DR

Modern web application for Quality Assurance and Safety Audits built with Next.js 15, React 19, TypeScript, and TailwindCSS. Features a complete design system following Atomic Design principles with shadcn/ui components.

**Quick Start:**
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Overview

The QASA Platform web application is a comprehensive facility management system for conducting audits, tracking incidents, and ensuring compliance. Built with modern web technologies and following best practices for scalability, maintainability, and developer experience.

### Key Features

- ✅ **Next.js 15 App Router** - Server-side rendering, optimized routing, and performance
- ✅ **React 19** - Latest React features and improvements
- ✅ **TypeScript** - Full type safety across the entire application
- ✅ **TailwindCSS + shadcn/ui** - Beautiful, accessible UI components
- ✅ **Atomic Design** - Scalable component architecture
- ✅ **Dark Mode** - Built-in theme switching with next-themes
- ✅ **React Query** - Efficient server state management
- ✅ **Zustand** - Simple local state management
- ✅ **Vitest + RTL** - Comprehensive testing setup
- ✅ **Storybook** - Component documentation and visual testing
- ✅ **ESLint + Prettier** - Code quality and consistency

---

## Tech Stack

| Layer                      | Technology             | Purpose                              |
| -------------------------- | ---------------------- | ------------------------------------ |
| **Framework**              | Next.js 15             | SSR, routing, optimization           |
| **UI Library**             | React 19               | Component-based UI                   |
| **Language**               | TypeScript 5.7         | Type safety                          |
| **Styling**                | TailwindCSS 3.4        | Utility-first CSS                    |
| **Component Library**      | shadcn/ui + Radix UI   | Accessible primitives                |
| **State (Local)**          | Zustand 5.0            | Client state management              |
| **State (Server)**         | React Query 5.62       | Server state & caching               |
| **Forms**                  | React Hook Form + Zod  | Form validation                      |
| **Icons**                  | Lucide React           | Icon system                          |
| **Animations**             | Framer Motion          | Smooth transitions                   |
| **Testing**                | Vitest + RTL           | Unit & integration tests             |
| **Documentation**          | Storybook 8.5          | Component catalog                    |
| **Code Quality**           | ESLint + Prettier      | Linting & formatting                 |

---

## Prerequisites

Ensure you have the following installed:

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0

Verify versions:
```bash
node --version
npm --version
```

---

## Installation

### 1. Install Dependencies

```bash
cd webapp
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the webapp directory:

```bash
cp .env.example .env.local
```

Update the environment variables as needed:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=QASA Platform
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server (port 3000)     |
| `npm run build`        | Build production bundle                  |
| `npm run start`        | Start production server                  |
| `npm run lint`         | Run ESLint                               |
| `npm run type-check`   | Run TypeScript compiler check            |
| `npm run test`         | Run tests with Vitest                    |
| `npm run test:ui`      | Run tests with UI                        |
| `npm run test:coverage`| Generate test coverage report            |
| `npm run storybook`    | Start Storybook dev server (port 6006)   |
| `npm run build-storybook` | Build static Storybook                |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting                    |

---

## Project Structure

```
webapp/
├── .storybook/              # Storybook configuration
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── dashboard/       # Dashboard route
│   │   ├── audits/          # Audits route
│   │   └── incidents/       # Incidents route
│   ├── components/
│   │   ├── ui/              # Atomic UI components (Button, Card, etc.)
│   │   ├── layout/          # Layout components (Header, Footer)
│   │   ├── providers/       # Context providers
│   │   └── index.ts         # Barrel exports
│   ├── hooks/               # Custom React hooks
│   │   ├── use-media-query.ts
│   │   ├── use-mounted.ts
│   │   └── index.ts
│   ├── lib/                 # Utilities and helpers
│   │   ├── utils.ts         # General utilities (cn, debounce, etc.)
│   │   ├── constants.ts     # App constants
│   │   └── api.ts           # API client
│   ├── store/               # Zustand stores
│   │   ├── use-theme-store.ts
│   │   └── index.ts
│   ├── styles/              # Global styles
│   │   └── globals.css      # Tailwind + CSS variables
│   ├── theme/               # Design tokens
│   │   ├── colors.ts
│   │   └── index.ts
│   ├── tests/               # Test utilities and setup
│   │   ├── setup.ts
│   │   └── test-utils.tsx
│   └── stories/             # Storybook stories
│       ├── Button.stories.tsx
│       └── Card.stories.tsx
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── vitest.config.ts         # Vitest configuration
└── package.json             # Dependencies and scripts
```

---

## Architecture

### Atomic Design Hierarchy

The component system follows Atomic Design principles:

| Level         | Description                    | Examples                        |
| ------------- | ------------------------------ | ------------------------------- |
| **Atoms**     | Basic building blocks          | Button, Input, Label            |
| **Molecules** | Simple component combinations  | FormField, SearchBar            |
| **Organisms** | Complex component sections     | Header, AuditForm, DataTable    |
| **Templates** | Page-level layouts             | DashboardLayout, AuthLayout     |
| **Pages**     | Actual routes                  | `/dashboard`, `/audits/[id]`    |

### Component Guidelines

1. **Every component must:**
   - Accept a `className` prop for style extension
   - Use TypeScript for props with strict typing
   - Follow the `cn()` utility for class merging
   - Use `class-variance-authority` (cva) for variants

2. **Example component structure:**

```tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: { default: '...', outline: '...' },
      size: { default: '...', sm: '...', lg: '...' }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)} 
      {...props} 
    />
  );
}
```

### State Management Strategy

| Type             | Tool         | Use Case                          |
| ---------------- | ------------ | --------------------------------- |
| **UI State**     | Zustand      | Theme, sidebar open, filters      |
| **Server State** | React Query  | API data, caching, mutations      |
| **Form State**   | React Hook Form | Form inputs, validation        |
| **Global Context** | React Context | Auth, user session             |

---

## Styling

### Design Tokens

All colors, spacing, and typography are defined as CSS variables in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... more tokens */
}
```

### Tailwind Configuration

Extend Tailwind with custom tokens in `tailwind.config.ts`:

```ts
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
}
```

### Dark Mode

Theme switching is handled by `next-themes`:

```tsx
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
setTheme('dark'); // or 'light', 'system'
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# With UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Writing Tests

Use the custom render from `test-utils.tsx` which includes providers:

```tsx
import { render, screen } from '@/tests/test-utils';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- **Components**: 80%+ coverage
- **Hooks**: 90%+ coverage
- **Utilities**: 95%+ coverage

---

## Storybook

### Running Storybook

```bash
npm run storybook
# Open http://localhost:6006
```

### Creating Stories

Every UI component should have a corresponding `.stories.tsx` file:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};
```

---

## Code Quality

### Linting

```bash
npm run lint
```

ESLint is configured with:
- Next.js rules
- TypeScript rules
- Storybook rules

### Formatting

```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format
```

Prettier is configured with Tailwind plugin for class sorting.

### Pre-commit Hooks (Optional)

To enforce quality gates before commits, add Husky:

```bash
npm install -D husky
npx husky init
```

Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npm run lint
npm run type-check
npm run format:check
```

---

## API Integration

### API Client

Use the centralized API client from `src/lib/api.ts`:

```tsx
import { api } from '@/lib/api';

// GET request
const data = await api.get('/audits');

// POST request
const result = await api.post('/audits', { name: 'New Audit' });

// With authentication
const data = await api.get('/protected', { token: userToken });
```

### React Query Integration

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Query
const { data, isLoading } = useQuery({
  queryKey: ['audits'],
  queryFn: () => api.get('/audits'),
});

// Mutation
const mutation = useMutation({
  mutationFn: (audit) => api.post('/audits', audit),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['audits'] });
  },
});
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Manual Build

```bash
npm run build
npm run start
```

---

## Environment Assumptions

- **Development**: Node 20+, local environment
- **QA**: Vercel preview deployments
- **Production**: Vercel production with CDN

### Before Implementation

Validate:
- Backend API is running and accessible
- Environment variables are correctly set
- CORS is configured for the webapp domain
- Authentication tokens are properly configured

---

## Performance Considerations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use Next.js `<Image>` component
- **Font Optimization**: Next.js font optimization enabled
- **Bundle Size**: Monitor with `@next/bundle-analyzer`
- **Caching**: React Query handles API response caching

---

## Security

- **Environment Variables**: Never commit `.env.local`
- **API Tokens**: Store in environment variables, not in code
- **Input Validation**: Use Zod schemas for all forms
- **XSS Protection**: React escapes by default
- **CSRF**: Configure API with proper headers

---

## Troubleshooting

### Common Issues

**Issue: Port 3000 already in use**
```bash
# Use different port
PORT=3001 npm run dev
```

**Issue: Module not found after install**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Issue: TypeScript errors**
```bash
# Regenerate types
npm run type-check
```

**Issue: Storybook not starting**
```bash
# Clear Storybook cache
npm run storybook -- --no-manager-cache
```

---

## Contributing

### Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Prefer composition over inheritance
- Write tests for new components
- Document with Storybook

### Pull Request Process

1. Create feature branch from `main`
2. Write code following guidelines
3. Add tests (maintain >80% coverage)
4. Create Storybook story
5. Run linting and formatting
6. Submit PR with description

---

## Roadmap

### Phase 1 (MVP) ✅
- [x] Core UI setup
- [x] Design tokens
- [x] Component library foundation
- [x] Storybook documentation

### Phase 2 (In Progress)
- [ ] Complete audit module
- [ ] Incident management
- [ ] User authentication
- [ ] API integration

### Phase 3 (Future)
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] Mobile responsive optimization
- [ ] PWA capabilities

---

## License

Proprietary - QASA Platform © 2025

---

## Contact & Support

**Author**: Esteban de la Peña  
**Version**: 0.1.0  
**Last Updated**: 2025-10-17

For issues or questions, contact the development team.


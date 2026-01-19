# TOEIC Learning Platform - Frontend

A modern, responsive learning platform for TOEIC preparation built with React, TypeScript, and shadcn/ui.

## Features

- 📚 **Book Library**: Browse and read TOEIC learning materials
- 📝 **Practice Tests**: Access TOEIC practice tests
- 🎧 **Audio Support**: Listen to audio materials for books with listening sections
- 🎨 **Modern UI**: Clean, professional interface built with shadcn/ui
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance**: Optimized with lazy loading and code splitting
- ♿ **Accessible**: WCAG AA compliant with keyboard navigation support

## Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with rolldown
- **shadcn/ui** - Component library (Radix UI + Tailwind CSS)
- **Tailwind CSS 4.x** - Styling
- **React Router 7.x** - Routing
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Header, Footer, Navigation)
│   │   ├── features/        # Feature-specific components
│   │   └── shared/          # Shared utility components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── lib/                 # Utilities
│   └── styles/              # Global styles
├── components.json          # shadcn/ui configuration
└── tailwind.config.js       # Tailwind configuration
```

## Theme Customization

The application uses a custom theme built on shadcn/ui. Theme colors and styles are defined in:

- `tailwind.config.js` - Tailwind theme configuration
- `src/index.css` - CSS custom properties for light/dark themes

### Color Palette

- **Primary**: Professional blue (#3B82F6)
- **Secondary**: Neutral gray
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Info**: Blue (#0EA5E9)

### Typography

- **Body**: Inter - Clean, readable sans-serif
- **Display**: Lexend - Modern, friendly headings

## Component Usage

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Example: Using Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        Content goes here
      </CardContent>
    </Card>
  );
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Performance Optimizations

- **Code Splitting**: Routes are lazy-loaded using React.lazy()
- **Image Optimization**: Lazy loading for images with proper sizing
- **Bundle Optimization**: Tree-shaking and minification
- **Caching**: Efficient caching strategies for static assets

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- WCAG AA color contrast ratios
- Focus indicators for keyboard users

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Ensure components are accessible
4. Test on multiple screen sizes
5. Add JSDoc comments for complex functions

## License

All rights reserved.

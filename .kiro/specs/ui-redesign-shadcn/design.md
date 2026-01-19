# Design Document - UI Redesign with shadcn/ui

## Overview

This design document outlines the comprehensive UI redesign of the TOEIC learning platform using shadcn/ui and tweakcn. The redesign transforms the current basic interface into a modern, professional learning platform that combines the aesthetics of ebook readers and elearning systems. The design maintains simplicity while providing an engaging, distraction-free learning experience.

### Design Goals

- Implement shadcn/ui component library with consistent theming
- Create a modern, clean interface inspired by ebook readers and elearning platforms
- Maintain existing functionality while improving visual hierarchy and user experience
- Establish a scalable component architecture for future features (vocabulary, translation)
- Optimize performance and accessibility

## Architecture

### Technology Stack

- **UI Framework**: React 19.2.0 with TypeScript
- **Component Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS 4.x with custom theme configuration
- **Customization Tool**: tweakcn for component theming
- **Build Tool**: Vite (rolldown-vite)
- **Routing**: React Router DOM 7.x

### Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   ├── layout/                # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── features/              # Feature-specific components
│   │   │   ├── BookCard.tsx
│   │   │   ├── TestCard.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   └── AudioPlayer.tsx
│   │   └── shared/                # Shared custom components
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorMessage.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BooksPage.tsx
│   │   ├── TestsPage.tsx
│   │   ├── BookViewer.tsx
│   │   └── AdminPage.tsx
│   ├── lib/
│   │   └── utils.ts               # shadcn/ui utilities
│   ├── hooks/
│   │   └── use-toast.ts           # Toast notifications
│   └── styles/
│       └── globals.css            # Global styles and theme
├── components.json                # shadcn/ui configuration
└── tailwind.config.js             # Tailwind + theme config
```

## Components and Interfaces

### 1. shadcn/ui Setup and Configuration

#### Installation Steps

1. Install shadcn/ui CLI and dependencies
2. Initialize shadcn/ui configuration
3. Configure Tailwind CSS with custom theme
4. Set up path aliases in tsconfig.json and vite.config.ts
5. Install tweakcn for theme customization

#### Theme Configuration

```typescript
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Learning platform specific colors
        success: "hsl(142, 76%, 36%)",
        warning: "hsl(38, 92%, 50%)",
        info: "hsl(199, 89%, 48%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Lexend", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }
}
```

### 2. Layout Components

#### MainLayout Component

Replaces the current `Layout.tsx` with enhanced structure:

```typescript
interface MainLayoutProps {
  children: ReactNode;
}

// Features:
// - Sticky header with navigation
// - Responsive sidebar (future use)
// - Main content area with proper spacing
// - Footer with links
// - Breadcrumb navigation
```

#### Header Component

```typescript
// Features:
// - Logo and branding
// - Main navigation tabs (Home, Books, Tests)
// - Search bar (future feature)
// - Theme toggle (future feature)
// - Uses shadcn/ui: Button, Separator
```

#### Navigation Component

```typescript
// Features:
// - Tab-based navigation using shadcn/ui Tabs
// - Active state highlighting
// - Smooth transitions
// - Mobile-responsive hamburger menu
```

### 3. Feature Components

#### BookCard / TestCard Components

Enhanced card design for displaying learning materials:

```typescript
interface BookCardProps {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  category: 'book' | 'test';
  pageCount?: number;
  duration?: number;
}

// Uses shadcn/ui components:
// - Card, CardHeader, CardTitle, CardDescription, CardContent
// - Badge (for category labels)
// - Button (for actions)
// - Hover effects and animations
```

**Design Features:**
- Clean card layout with cover image
- Category badge (Book/Test)
- Metadata display (pages, duration)
- Hover effects with subtle elevation
- Click to open/start action

#### PDFViewer Component

Enhanced PDF reading experience:

```typescript
interface PDFViewerProps {
  bookId: string;
  initialPage?: number;
}

// Uses shadcn/ui components:
// - Button (navigation controls)
// - Slider (zoom control)
// - Separator
// - Tooltip (for controls)
```

**Design Features:**
- Clean reading interface
- Floating control panel
- Page navigation
- Zoom controls
- Progress indicator
- Bookmark functionality (future)

#### TestCard Component

Specialized card for test display:

```typescript
interface TestCardProps {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Uses shadcn/ui components:
// - Card with custom styling
// - Badge (difficulty level)
// - Progress indicator
```

### 4. Page Designs

#### HomePage

**Layout:**
- Hero section with welcome message and CTA
- Tabbed interface for Books and Tests
- Grid layout for content cards
- Quick stats section (total books, tests)

**Components Used:**
- Tabs (shadcn/ui)
- Card grid
- Button
- Separator

#### BooksPage (New)

Dedicated page for browsing books:
- Filter sidebar (by category, difficulty)
- Grid/List view toggle
- Search functionality
- Pagination

#### TestsPage (New)

Dedicated page for browsing tests:
- Filter by difficulty, duration
- Test statistics
- Start test CTA
- Recent tests section

#### BookViewer

Enhanced reading experience:
- Full-screen PDF viewer
- Minimal UI with auto-hide controls
- Reading progress
- Navigation sidebar (table of contents)

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  radius: string;
  font: {
    sans: string[];
    display: string[];
  };
}
```

### Component Props

```typescript
// Existing Book interface (from api.ts)
interface Book {
  id: string;
  title: string;
  description?: string;
  category: 'book' | 'test';
  coverImage?: string;
  pdfPath: string;
  audioPath?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced for UI
interface BookCardData extends Book {
  pageCount?: number;
  duration?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}
```

## Error Handling

### Loading States

- Use shadcn/ui Skeleton components for loading states
- Consistent loading spinner design
- Progressive loading for images and PDFs

### Error States

```typescript
// Error message component using shadcn/ui Alert
interface ErrorMessageProps {
  title: string;
  message: string;
  retry?: () => void;
}

// Uses: Alert, AlertTitle, AlertDescription, Button
```

### Fallback UI

- Graceful degradation for missing images
- Default placeholder for book covers
- Error boundaries for component failures

## Testing Strategy

### Component Testing

1. **shadcn/ui Integration Tests**
   - Verify all installed components render correctly
   - Test theme customization
   - Validate accessibility attributes

2. **Layout Component Tests**
   - Navigation functionality
   - Responsive behavior
   - Route transitions

3. **Feature Component Tests**
   - BookCard interactions
   - PDF viewer controls
   - Audio player functionality

### Visual Regression Testing

- Screenshot comparison for key pages
- Theme consistency checks
- Responsive layout validation

### Accessibility Testing

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios (WCAG AA)
- Focus management

## Implementation Phases

### Phase 1: Foundation Setup
- Install and configure shadcn/ui
- Set up tweakcn
- Configure Tailwind theme
- Create base component structure

### Phase 2: Core Components
- Implement layout components (Header, Navigation, Footer)
- Create shadcn/ui component library
- Build shared components (Loading, Error)

### Phase 3: Feature Components
- Redesign BookCard and TestCard
- Enhance PDFViewer
- Update AudioPlayer

### Phase 4: Page Redesign
- Redesign HomePage with tabs
- Create BooksPage and TestsPage
- Enhance BookViewer

### Phase 5: Polish and Optimization
- Add animations and transitions
- Optimize performance
- Accessibility improvements
- Documentation

## Design Decisions and Rationales

### Why shadcn/ui?

1. **Copy-paste approach**: Components are added to the project, allowing full customization
2. **Built on Radix UI**: Excellent accessibility out of the box
3. **Tailwind CSS**: Consistent with existing styling approach
4. **TypeScript support**: Type-safe components
5. **No runtime overhead**: Components are part of the codebase

### Why tweakcn?

1. **Theme management**: Easy customization of shadcn/ui components
2. **Consistency**: Ensures uniform styling across components
3. **Rapid prototyping**: Quick theme iterations

### Color Scheme

- **Primary Blue**: Professional, trustworthy (learning platform)
- **Neutral Grays**: Clean, minimal distraction (ebook aesthetic)
- **Accent Colors**: Success (green), Warning (amber), Info (blue)
- **High Contrast**: Ensures readability for long study sessions

### Typography

- **Sans-serif**: Inter for body text (excellent readability)
- **Display**: Lexend for headings (modern, friendly)
- **Font Sizes**: Comfortable reading sizes (16px base)

### Layout Philosophy

- **Whitespace**: Generous spacing for reduced cognitive load
- **Grid System**: Consistent 4-column grid on desktop
- **Card-based**: Familiar pattern for content organization
- **Minimal Navigation**: Focus on content, not chrome

## Future Considerations

### Planned Features (Not in Current Scope)

1. **Vocabulary Section**: Card-based vocabulary learning
2. **Translation Tool**: Integrated translation feature
3. **Dark Mode**: Theme toggle with persistence
4. **Progress Tracking**: Visual progress indicators (without authentication)
5. **Bookmarks**: Save reading positions
6. **Notes**: Inline annotations (local storage)

### Scalability

- Component architecture supports easy addition of new features
- Theme system allows quick visual updates
- Modular design enables feature toggles

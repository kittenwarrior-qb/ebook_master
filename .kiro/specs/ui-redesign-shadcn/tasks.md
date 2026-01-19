# Implementation Plan - UI Redesign with shadcn/ui

- [x] 1. Setup shadcn/ui and project configuration





  - Install shadcn/ui CLI and initialize configuration with `npx shadcn@latest init`
  - Configure path aliases in tsconfig.json (@/components, @/lib, @/hooks)
  - Update vite.config.ts to support path aliases
  - Install tailwindcss-animate plugin for animations
  - Create lib/utils.ts with cn() utility function for class merging
  - _Requirements: 1.1, 5.1, 5.2_

- [x] 2. Configure theme and styling foundation








  - Update tailwind.config.js with custom theme colors, fonts, and radius variables
  - Create/update src/styles/globals.css with CSS custom properties for theme
  - Add Inter and Lexend font imports to index.html
  - Configure dark mode support in Tailwind config (class-based)
  - Test theme variables are working correctly
  - _Requirements: 1.2, 1.1_


- [x] 3. Install core shadcn/ui components

  - Install Button component: `npx shadcn@latest add button`
  - Install Card component: `npx shadcn@latest add card`
  - Install Badge component: `npx shadcn@latest add badge`
  - Install Tabs component: `npx shadcn@latest add tabs`
  - Install Separator component: `npx shadcn@latest add separator`
  - Install Skeleton component: `npx shadcn@latest add skeleton`
  - Install Alert component: `npx shadcn@latest add alert`
  - Verify all components are in src/components/ui/ directory
  - _Requirements: 1.1, 5.1_

- [x] 4. Create shared utility components


  - Create src/components/shared/LoadingSpinner.tsx using Skeleton component
  - Create src/components/shared/ErrorMessage.tsx using Alert component
  - Add proper TypeScript interfaces for component props
  - _Requirements: 6.2, 5.3_


- [x] 5. Build new layout component structure

  - Create src/components/layout/Header.tsx with logo, navigation, and styling
  - Create src/components/layout/Navigation.tsx using Tabs component for main nav
  - Create src/components/layout/Footer.tsx with copyright and links
  - Create src/components/layout/MainLayout.tsx to compose header, content area, and footer
  - Implement responsive design with mobile hamburger menu (future enhancement marker)
  - _Requirements: 1.3, 1.5, 2.1, 2.3_

- [x] 6. Redesign BookCard component


  - Update src/components/BookCard.tsx to use shadcn/ui Card components
  - Add Badge component for category display (Book/Test)
  - Implement hover effects and animations using Tailwind
  - Add metadata display (page count, duration) with proper typography
  - Add click handler to navigate to book viewer
  - Ensure responsive design for mobile and desktop
  - _Requirements: 1.2, 1.3, 2.4, 3.2_

- [x] 7. Create TestCard component


  - Create src/components/features/TestCard.tsx using Card component
  - Add Badge for difficulty level (easy/medium/hard) with color coding
  - Display test metadata (question count, duration)
  - Add "Start Test" button with primary styling
  - Implement hover effects consistent with BookCard
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 8. Enhance PDFViewer component


  - Update src/pages/BookViewer.tsx with cleaner layout using shadcn/ui components
  - Add floating control panel using Button components for navigation
  - Implement page navigation controls (prev/next) with proper icons
  - Add zoom controls and progress indicator
  - Style with minimal UI that auto-hides on inactivity (future enhancement marker)
  - Ensure responsive design for different screen sizes
  - _Requirements: 4.1, 4.2, 4.3, 6.3_


- [x] 9. Redesign HomePage with tabbed interface

  - Update src/pages/HomePage.tsx to use Tabs component for Books/Tests sections
  - Add hero section with welcome message and description
  - Implement grid layout for BookCard and TestCard components
  - Add loading states using Skeleton components
  - Add error handling using ErrorMessage component
  - Ensure smooth tab transitions and proper active state
  - _Requirements: 1.4, 2.1, 2.2, 2.3, 6.1, 6.2_

- [x] 10. Create dedicated BooksPage


  - Create src/pages/BooksPage.tsx for browsing all books
  - Implement grid layout with BookCard components
  - Add filter section placeholder (for future implementation)
  - Add search bar placeholder (for future implementation)
  - Implement loading and error states
  - Add pagination placeholder (for future implementation)
  - _Requirements: 2.1, 2.2, 4.4_


- [x] 11. Create dedicated TestsPage

  - Create src/pages/TestsPage.tsx for browsing all tests
  - Implement grid layout with TestCard components
  - Add filter by difficulty and duration placeholders
  - Display test statistics section (total tests, categories)
  - Implement loading and error states
  - Add "Start Test" CTAs with proper routing
  - _Requirements: 2.1, 2.2, 3.1, 3.4_

- [x] 12. Update routing and navigation


  - Update src/App.tsx to use new MainLayout component
  - Add routes for /books and /tests pages
  - Update Navigation component with proper route highlighting
  - Ensure smooth transitions between pages
  - Test all navigation paths work correctly
  - _Requirements: 2.2, 2.3, 1.5_


- [x] 13. Update AudioPlayer component styling

  - Update src/components/AudioPlayer.tsx to use shadcn/ui Button components
  - Ensure consistent styling with overall design theme
  - Add proper hover states and transitions
  - Maintain existing audio functionality
  - _Requirements: 1.2, 1.4_



- [ ] 14. Implement responsive design refinements
  - Test all pages on mobile, tablet, and desktop viewports
  - Adjust grid layouts for different screen sizes (1, 2, 3, 4 columns)
  - Ensure navigation works on mobile (hamburger menu if needed)
  - Test touch interactions on mobile devices
  - Verify all text is readable at different sizes


  - _Requirements: 1.3, 1.4_

- [ ] 15. Add animations and transitions
  - Add page transition animations using Tailwind transitions
  - Implement card hover effects with scale and shadow
  - Add smooth tab switching animations
  - Implement loading skeleton animations


  - Add button press feedback animations
  - Ensure animations are performant (60fps)
  - _Requirements: 1.4, 6.2_

- [ ] 16. Performance optimization
  - Implement lazy loading for PDF content in BookViewer

  - Optimize image loading with proper sizing and lazy loading
  - Code-split routes using React.lazy() and Suspense
  - Minimize bundle size by checking for unused shadcn/ui components
  - Test initial page load time meets <2s requirement
  - _Requirements: 6.1, 6.3, 6.4_

- [x] 17. Accessibility improvements

  - Add proper ARIA labels to all interactive elements
  - Ensure keyboard navigation works for all components
  - Test with screen reader (NVDA/JAWS)
  - Verify color contrast ratios meet WCAG AA standards
  - Add focus indicators for keyboard navigation
  - Test tab order is logical throughout the application
  - _Requirements: 1.2, 1.3_


- [x] 18. Documentation and cleanup

  - Add JSDoc comments to all new components
  - Document theme customization in README
  - Create component usage examples
  - Remove old unused components and styles
  - Update project README with new UI features
  - _Requirements: 5.4_


- [x] 19. Visual regression testing setup


  - Set up screenshot testing for key pages
  - Create baseline screenshots for HomePage, BooksPage, TestsPage
  - Document visual testing process
  - _Requirements: 1.2_

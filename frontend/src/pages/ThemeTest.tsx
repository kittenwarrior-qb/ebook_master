/**
 * Theme Test Page
 * This page tests all theme variables and custom colors
 * Can be accessed at /theme-test during development
 */

export default function ThemeTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-display font-bold">Theme Test Page</h1>
        <p className="text-muted-foreground">
          Testing all theme variables, colors, fonts, and styling foundation
        </p>
      </div>

      {/* Typography Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-display">Heading 1 - Lexend Display</h1>
          <h2 className="text-3xl font-display">Heading 2 - Lexend Display</h2>
          <h3 className="text-2xl font-display">Heading 3 - Lexend Display</h3>
          <p className="text-base font-sans">Body text - Inter Sans</p>
          <p className="text-sm text-muted-foreground">Muted text - Inter Sans</p>
        </div>
      </section>

      {/* Color Palette Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Color Palette</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Background & Foreground */}
          <div className="space-y-2">
            <div className="h-20 bg-background border-2 border-border rounded-lg flex items-center justify-center">
              <span className="text-foreground text-sm">Background</span>
            </div>
            <p className="text-xs text-center">background/foreground</p>
          </div>

          {/* Primary */}
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">Primary</span>
            </div>
            <p className="text-xs text-center">primary</p>
          </div>

          {/* Secondary */}
          <div className="space-y-2">
            <div className="h-20 bg-secondary rounded-lg flex items-center justify-center">
              <span className="text-secondary-foreground text-sm font-medium">Secondary</span>
            </div>
            <p className="text-xs text-center">secondary</p>
          </div>

          {/* Muted */}
          <div className="space-y-2">
            <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">Muted</span>
            </div>
            <p className="text-xs text-center">muted</p>
          </div>

          {/* Accent */}
          <div className="space-y-2">
            <div className="h-20 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground text-sm font-medium">Accent</span>
            </div>
            <p className="text-xs text-center">accent</p>
          </div>

          {/* Destructive */}
          <div className="space-y-2">
            <div className="h-20 bg-destructive rounded-lg flex items-center justify-center">
              <span className="text-destructive-foreground text-sm font-medium">Destructive</span>
            </div>
            <p className="text-xs text-center">destructive</p>
          </div>

          {/* Card */}
          <div className="space-y-2">
            <div className="h-20 bg-card border border-border rounded-lg flex items-center justify-center">
              <span className="text-card-foreground text-sm font-medium">Card</span>
            </div>
            <p className="text-xs text-center">card</p>
          </div>

          {/* Popover */}
          <div className="space-y-2">
            <div className="h-20 bg-popover border border-border rounded-lg flex items-center justify-center">
              <span className="text-popover-foreground text-sm font-medium">Popover</span>
            </div>
            <p className="text-xs text-center">popover</p>
          </div>
        </div>
      </section>

      {/* Learning Platform Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Learning Platform Colors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Success */}
          <div className="space-y-2">
            <div className="h-20 bg-success rounded-lg flex items-center justify-center">
              <span className="text-success-foreground text-sm font-medium">Success</span>
            </div>
            <p className="text-xs text-center">Correct answers, achievements</p>
          </div>

          {/* Warning */}
          <div className="space-y-2">
            <div className="h-20 bg-warning rounded-lg flex items-center justify-center">
              <span className="text-warning-foreground text-sm font-medium">Warning</span>
            </div>
            <p className="text-xs text-center">Alerts, important notices</p>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <div className="h-20 bg-info rounded-lg flex items-center justify-center">
              <span className="text-info-foreground text-sm font-medium">Info</span>
            </div>
            <p className="text-xs text-center">Tips, information</p>
          </div>
        </div>
      </section>

      {/* Border Radius Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Border Radius</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-xs">sm</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground text-xs">md</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-xs">lg</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-20 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground text-xs">xl</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Elements Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Interactive Elements</h2>
        
        <div className="space-y-4">
          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-opacity">
              Secondary Button
            </button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity">
              Destructive Button
            </button>
          </div>

          {/* Input */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Test input field"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Card */}
          <div className="max-w-md p-6 bg-card border border-border rounded-lg shadow-sm">
            <h3 className="text-lg font-display font-semibold text-card-foreground mb-2">
              Card Component
            </h3>
            <p className="text-sm text-muted-foreground">
              This is a test card using the card background and border colors.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Mode Toggle Test */}
      <section className="space-y-4">
        <h2 className="text-2xl font-display font-semibold">Dark Mode</h2>
        <p className="text-sm text-muted-foreground">
          Toggle dark mode by adding the "dark" class to the html element in DevTools
        </p>
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Toggle Dark Mode
        </button>
      </section>
    </div>
  );
}

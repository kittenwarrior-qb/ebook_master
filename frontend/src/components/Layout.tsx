import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">📚 TOEIC Master</h1>
            </Link>
            <nav className="flex gap-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary font-medium"
              >
                Home
              </Link>
              <Link 
                to="/admin" 
                className="text-foreground hover:text-primary font-medium"
              >
                🔧 Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-muted-foreground text-sm">
            © 2026 TOEIC Master - Free TOEIC Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

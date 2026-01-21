import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const BooksPage = lazy(() => import('./pages/BooksPage'));
const TestsPage = lazy(() => import('./pages/TestsPage'));
const BookViewer = lazy(() => import('./pages/BookViewer'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const BookManagementPage = lazy(() => import('./pages/BookManagementPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <MainLayout>
          <div className="flex justify-center items-center min-h-150">
            <LoadingSpinner count={1} />
          </div>
        </MainLayout>
      }>
        <Routes>
          {/* Main routes with MainLayout */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/books" element={<MainLayout><BooksPage /></MainLayout>} />
          <Route path="/tests" element={<MainLayout><TestsPage /></MainLayout>} />
          <Route path="/book/:bookId" element={<MainLayout><BookViewer /></MainLayout>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<MainLayout><AdminPage /></MainLayout>} />
          <Route path="/admin/books" element={<MainLayout><BookManagementPage /></MainLayout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

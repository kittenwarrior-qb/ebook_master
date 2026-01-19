import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookViewer from './pages/BookViewer';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:bookId" element={<BookViewer />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

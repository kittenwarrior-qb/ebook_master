import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add session ID to requests for progress tracking
api.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  config.headers['x-session-id'] = sessionId;
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export interface Book {
  id: number;
  title: string;
  category: string;
  hasListening: boolean;
  totalPages: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  book_id: number;
  last_page_number: number;
  last_accessed_at?: string;
}

// Books API
export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get('/api/books');
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Book[]> => {
    const response = await api.get(`/api/books?category=${category}`);
    return response.data;
  },
};

// Pages API
export const pagesApi = {
  getPageImage: (bookId: number, pageNumber: number): string => {
    return `${API_URL}/api/books/${bookId}/pages/${pageNumber}`;
  },
};

// Audio API
export const audioApi = {
  getAudioUrl: (bookId: number): string => {
    return `${API_URL}/api/books/${bookId}/audio`;
  },
};

// Progress API
export const progressApi = {
  getProgress: async (bookId: number): Promise<Progress> => {
    const response = await api.get(`/api/progress/${bookId}`);
    return response.data;
  },

  saveProgress: async (bookId: number, pageNumber: number): Promise<void> => {
    await api.post(`/api/progress/${bookId}`, {
      page_number: pageNumber,
    });
  },

  getAllProgress: async (): Promise<Progress[]> => {
    const response = await api.get('/api/progress');
    return response.data;
  },
};

export default api;

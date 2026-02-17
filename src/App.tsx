import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import { TeacherRoute, TeacherOnlyRegisterRoute } from './components/RouteGuards';

import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const App: React.FC = () => (
  <ThemeProvider>
    <GlobalStyles />
    <Toaster
      position="top-right"
      containerStyle={{ top: 76 }}
      toastOptions={{
        duration: 4000,
        style: { borderRadius: '8px', fontSize: '0.875rem', zIndex: 9999 },
      }}
    />
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<TeacherOnlyRegisterRoute><Register /></TeacherOnlyRegisterRoute>}
          />
          <Route
            path="/posts/new"
            element={<TeacherRoute><CreatePost /></TeacherRoute>}
          />
          <Route
            path="/posts/:id/edit"
            element={<TeacherRoute><EditPost /></TeacherRoute>}
          />
          <Route
            path="/admin"
            element={<TeacherRoute><Admin /></TeacherRoute>}
          />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;

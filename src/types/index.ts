export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author_name: string;
  author_id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

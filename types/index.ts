export interface Movie {
  _id: string;
  title: string;
  desc?: string;
  img?: string;
  imgTitle?: string;
  imgSm?: string;
  trailer?: string;
  video?: string;
  year?: string;
  limit?: number;
  genre?: string;
  rating?: number;
  quality?: string;
  isSeries: boolean;
  tags: string[];
  views?: number;
  country?: string;
  duration?: string;
  story?: string;
  style?: string;
  plot?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieList {
  _id: string;
  title: string;
  type?: string;
  genre?: string;
  content: string[];
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JwtPayload {
  id: string;
  isAdmin: boolean;
}

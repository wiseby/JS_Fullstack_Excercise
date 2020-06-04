export interface LoginRequest {
  name: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  isSubscriber: boolean;
}

export interface ChangeUserRequest {
  userData: {
    name: string;
    email: string;
    isSubscriber: boolean;
  }
  password: string;
}
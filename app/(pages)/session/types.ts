export type AuthSignInResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
};

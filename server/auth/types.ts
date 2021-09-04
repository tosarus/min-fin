export interface AuthUser {
  name: string;
  picture: string;
  email: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  locale?: string;
}

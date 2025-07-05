// src/lib/auth/config.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { authApi } from '@/lib/api/auth';
import { User } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'user@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.success && response.data) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.fullName,
              role: response.data.user.role,
              accessToken: response.data.tokens.accessToken,
              refreshToken: response.data.tokens.refreshToken,
              expiresAt: response.data.tokens.expiresAt,
            };
          }

          throw new Error('Invalid credentials');
        } catch (error: any) {
          console.error('Authentication error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.role = user.role;
      }

      // Check if token is expired
      if (token.expiresAt && Date.now() >= Number(token.expiresAt) * 1000) {
        try {
          const response = await authApi.refreshToken(token.refreshToken as string);
          
          if (response.success && response.data) {
            token.accessToken = response.data.accessToken;
            token.refreshToken = response.data.refreshToken;
            token.expiresAt = response.data.expiresAt;
          } else {
            // Refresh failed, force logout
            return {};
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          return {};
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }

      return session;
    },
  },

  events: {
    async signOut({ token }) {
      try {
        if (token.accessToken) {
          await authApi.logout(token.accessToken as string);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
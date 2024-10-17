import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("tracking_system");

        // Find user by email
        const user = await db.collection("users").findOne({ email: credentials?.email });

        if (user && credentials) {
          // Check if the password matches
          const isValid = await compare(credentials.password, user.password);
          if (isValid) {
            return { id: user._id.toString(), name: user.username, email: user.email };
          }
        }

        // Return null if user not found or password doesn't match
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/dashboard/login', // Set custom login page route
  },
  session: {
    strategy: 'jwt' as 'jwt' | 'database',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
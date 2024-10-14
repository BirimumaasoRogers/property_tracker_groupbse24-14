import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Dummy user check
        const user = { id: "1", name: "John Doe", email: "john.doe@example.com" };

        if (
          credentials?.email === "john.doe@example.com" &&
          credentials?.password === "password123"
        ) {
          return user; // Return user if credentials match
        } else {
          return null; // Return null if credentials don't match
        }
      },

    }),
  ],
  pages: {
    signIn: '/dashboard/login', // Set custom login page route
  },
  session: {
    strategy: 'jwt' as 'jwt',
  },
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.sub; // Append user ID to session
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Store securely in .env.local
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

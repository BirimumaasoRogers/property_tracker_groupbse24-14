import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        const user = { id: "1", name: "John Doe", email: "john.doe@example.com" } as const;

        if (credentials && 
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
  secret: process.env.NEXTAUTH_SECRET, // Store securely in .env.local
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

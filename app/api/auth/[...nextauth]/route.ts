import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the authentication options
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GG_ID as string,
            clientSecret: process.env.GG_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === 'google') {
                const email = profile?.email || '';
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            name: profile?.name,
                            email,
                        },
                    });
                }

                return true;
            }
            return true;
        },
    },
};

// Create the handler with NextAuth
const handler = NextAuth(authOptions);

// Export the handler as the GET and POST methods of the API route
export { handler as GET, handler as POST };

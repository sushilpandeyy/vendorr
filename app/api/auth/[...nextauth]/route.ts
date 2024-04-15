import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
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

// Create the NextAuth handler with the authOptions
const handler = NextAuth(authOptions);

// Export the handler as the default export from the file
export default handler;

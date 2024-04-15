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
        async signIn({ account, profile }): Promise<boolean> {
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

const handler = NextAuth(authOptions);

export default handler;
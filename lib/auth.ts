import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const isProd = process.env.NODE_ENV === 'production';
const authSecret = process.env.NEXTAUTH_SECRET;

if (isProd && !authSecret) {
    throw new Error('NEXTAUTH_SECRET must be set in production');
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    admin.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: admin.id,
                    name: admin.email,
                };
            },
        }),
    ],
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            if (user?.id) {
                await prisma.admin.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });
            }
        },
    },
    secret: authSecret,
};

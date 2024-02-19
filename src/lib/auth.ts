import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const whitelist = ['lautarosoffici@gmail.com', 'julieta.pontino@gmail.com'];

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === 'google') {
                const email = profile?.email;
                // Email is in the whitelist, so we allow access
                if (email && whitelist.includes(email)) {
                    return true;
                }
                // Email not in the whitelist, so we don't allow access
                else {
                    return false;
                }
            }
            // Provider is not Google, so we don't allow access
            return false;
        }
    }
};

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing email or password')
                    return null
                }

                try {
                    // Import prisma and bcrypt dynamically to avoid edge runtime issues
                    const { prisma } = await import("@/lib/prisma")
                    const bcryptModule = await import("bcryptjs")
                    const bcrypt = bcryptModule.default

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string }
                    })

                    if (!user) {
                        console.log('User not found:', credentials.email)
                        return null
                    }

                    if (!user.password) {
                        console.log('User has no password')
                        return null
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    if (!passwordMatch) {
                        console.log('Password mismatch for:', credentials.email)
                        return null
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
})

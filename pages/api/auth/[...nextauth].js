import client from '@/lib/db'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import EmailProvider from 'next-auth/providers/email'

const adminEmails= ['ahmedmtawahg@gmail.com','alphateam.v4.0@gmail.com']

const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    
  ],

  adapter : MongoDBAdapter(client),
  callbacks: {
    session: ({session, token, user}) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session
      }else {
        return false
      }
    },
  },
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw "Not an admin"
  }
}
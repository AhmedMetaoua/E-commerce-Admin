import client from '@/lib/db'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import Setting from '@/models/Setting'

// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import EmailProvider from 'next-auth/providers/email'

// const adminEmails= ['ahmedmtawahg@gmail.com','alphateam.v4.0@gmail.com','metaouaahmed@isimm.u-monastir.tn']

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    CredentialsProvider({
      name: 'credentials',
      credentials: {},

      async authorize(credentials){
        const {email, password} = credentials

        try{
          await dbConnect();

          // Step 1: Check if user exists in Users collection
          const user = await User.findOne({email});
          if (!user) {
            throw new Error('User not found');
          }

          // Step 2: Validate password
          const passwordMatch = await bcrypt.compare(password, user.password);
          if(!passwordMatch) {
            throw new Error('Incorrect password');
          }

          // Step 3: Check if email exists in Setting.users and has role Admin or Manager
          const setting = await Setting.findOne({
            users: {
              $elemMatch: {
                email: email,
                role: { $in: ['Admin', 'Manager'] }
              }
            }
          });
          if (!setting) {
            throw new Error('Access denied: not an Admin or Manager');
          }

          console.log('Authorized user:', user);
          return user;

        }catch(error){
          console.error('Authorize Error:', error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },

  // adapter : MongoDBAdapter(client),
  // callbacks: {
  //   session: ({session, token, user}) => {
  //     if (adminEmails.includes(session?.user?.email)) {
  //       return session
  //     }else {
  //       return false
  //     }
  //   },
  // },
}

export default NextAuth(authOptions)


// export default NextAuth(authOptions)

// export async function isAdminRequest(req, res) {
//   const session = await getServerSession(req, res, authOptions)
//   console.log("Session:", session);
//   if (!adminEmails.includes(session?.user?.email)) {
//     res.status(401)
//     res.end("Not an admin")
//     throw "Not an admin"
//   }
// }
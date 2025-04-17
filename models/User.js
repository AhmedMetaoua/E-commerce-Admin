import mongoose, { model, models, Schema } from 'mongoose'

const userSchema = new Schema({
  userName : {type: String, require: true},
  email : {type: String, require: true},
  password : {type: String, require: true},
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true })

const User = models.User || model('User', userSchema)

export default User

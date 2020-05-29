import mongoose from "mongoose";
import { isEmail } from "validator";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    firstname: {
      type: String,
    },
    surname: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (string) => isEmail(string),
        message: "Provided email is invalid",
      },
    },

    role: {
      type: String,
      default: "developer",
      enum: ["company", "developer", "admin"],
    },

    location: {
      type: String,
    },

    github: {
      type: String,
    },

    linkedIn: {
      type: String,
    },
    refreshtoken: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const options = {
  usernameField: "email",
};

userSchema.plugin(passportLocalMongoose, options);

const userCollection = "users";

export default mongoose.model(userCollection, userSchema);

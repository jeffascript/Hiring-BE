import mongoose, { mongo } from "mongoose";
import { isEmail } from "validator";
import passportLocalMongoose from "passport-local-mongoose";


const selectedTasks = new mongoose.Schema({

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks"
  },
  deadline: {
    type: Date
  },

  isTaskCompleted:{
    type: Boolean,
    default: false
  },

  submittedOnTime:{
    type: Boolean
    // default: false
  }



})



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim:true
    },

    firstname: {
      type: String,
      trim:true
    },
    surname: {
      type: String,
      trim:true
    },
    email: {
      type: String,
      // required: true,
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
      trim:true
    },

    selectedTasks: [selectedTasks],

    location: {
      type: String,
      trim:true
    },

    github: {
      type: String,
      trim:true
    },

    linkedIn: {
      type: String,
      trim:true
    },
    refreshtoken: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
    linkedinId:{
      type: String,
      trim:true
    },
    image:{
      type: String,
      trim:true
    },
    githubId:{
      type: String,
      trim:true
    },
    refreshtoken:{
      type: String,
      trim:true
    }
  },
  {
    timestamps: true,
  }
);

const options = {
  usernameQueryFields: ["email"],
};

userSchema.plugin(passportLocalMongoose, options);

const userCollection = "users";

export default mongoose.model(userCollection, userSchema);

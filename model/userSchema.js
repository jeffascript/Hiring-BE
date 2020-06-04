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

    selectedTasks: [selectedTasks],

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
    linkedinId:String,
    image: String
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

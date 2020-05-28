import mongoose from "mongoose"



const attemptedBy = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",

    },

    repo: String,
    
    deliveryTime: {
        type: Date
        // default: Date.now
    }

})

const taskSchema = new mongoose.Schema({

    taskTitle:{
        type: String
    },

    taskDescription: {
        type: String
    },

    postedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    techStack:[String],

    approvedByAdmin:{
        type:Boolean,
        default: false
    },
    
    position:{
        type: String
    },

    salaryRange:{
        currency: String,
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 }
        
    },
    location: {
        type: { 
            type: String,
            enum: ['Point'],
            default:'Point'  
        },
        coordinates: []
       },

    timeFrame: Number,

    attemptedBy: [attemptedBy],

    taskIsOpen: {
        type: Boolean,
        default: true
    }


    

},{ timestamps: true})


taskSchema.index({ location: "2dsphere" })

const taskCollection = "tasks"

export default mongoose.model(taskCollection, taskSchema)

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



const geoSchema = mongoose.Schema({
    type: {
        type: String,
        default: 'Point'
        
        
        
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
  });



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
    geometry: geoSchema,

    timeFrame: Number,


    attemptedBy: [attemptedBy],

    taskIsOpen: {
        type: Boolean,
        default: true
    },
    city: String


    

},{ timestamps: true})


//  taskSchema.index({ geometry: "2dsphere" })

const taskCollection = "tasks"

export default mongoose.model(taskCollection, taskSchema)

import { Router } from "express"
import { UserModel, TaskModel } from "../model"
import passport from "passport"

import { onlyAdmin, getGeo, onlyDeveloper, getNewGeo } from "../middleware"
import mongoose from "mongoose"

const router = Router(); 



router.post("/admin",  passport.authenticate("jwt"), onlyAdmin,getNewGeo, async(req , res)=>{
   try {
    const { username } = req.user
    const usernameExists  = await UserModel.findOne({ username }) //destructuring, since it shouldbe  ({  username : username }) 
    if(!usernameExists)
        res.status(404).send({msg: ` Username : ${username} does not exist`})
    
        let { postedby = new mongoose.Schema.Types.ObjectId(postedby)  } =  req.body

           
        // const cityName =  await getGeo(req.body.city);
        // const geoLo = Object.values(cityName)
       
        let  body = {...req.body, username }



        console.log(req.body)

        let newTask = await TaskModel.create(body)
        newTask = await newTask.populate({path: "postedby", select: "username email firstname surname" }).execPopulate()

        // console.log(geoLocation)

        res.send(newTask)
    

   } catch (error) {
       console.log(error)
       res.status(500).send({ error })
   }
});




router.get("/developer", passport.authenticate("jwt"),onlyDeveloper, async(req,res)=>{
    try {

        const taskTotal =  await TaskModel.countDocuments()

        const query = req.query;

        const allTasks = await TaskModel.find(query)
       
        if ( taskTotal <= 0) {
            res.status(404).send({ message: "No Task found" });
          }
       

            if(query.lat && query.lng){
             const tasksWithNearDistance =  await TaskModel
            //  .find(
            //     { point :
            //         { $near :
            //            {
            //              $geometry : {
            //                 type : "Point" ,
            //                 coordinates : [parseFloat(req.query.lat), parseFloat(req.query.lng)]},
            //              $maxDistance : 1000000
            //            }
            //         }
            //      }
            //  )
             
             .aggregate().near({
                    near: {
                     'type': 'Point',
                     'coordinates': [parseFloat(req.query.lat), parseFloat(req.query.lng)]
                    },
                    maxDistance: 1000000,
                    spherical: true,
                    distanceField: "distance"
                   })
    
    
                   res.send({total: taskTotal, tasksWithNearDistance })
    
            }
            else{
                
                res.send({total: taskTotal, allTasks})
           


        } 

    
    } catch (error) {
        console.log(error)
        res.status(500).send({err: error })
    }
    

});




router.put("/submission/:id", passport.authenticate("jwt"),onlyDeveloper, async(req,res)=>{

    const taskIsValid = await TaskModel.findById(req.params.id)
    if(!taskIsValid){
        res.status(404).send({msg: " Task with id does not exist"})
    }
    
    const { repo } = req.body

    let submissionDetails = { repo, deliveryTime: Date.now(), userInfo: req.user._id}

    const submitResult = await TaskModel.findByIdAndUpdate(req.params.id, {
        $push:{
            attemptedBy: submissionDetails
        }
    }, { new : true }).populate({path: "attemptedBy.userInfo", select: "username email firstname surname"})


    // I need to check deadline, isTaskCompleted, & submittedOntime from User schema

    let updateUserBody  =  { isTaskCompleted: true }
    const newBody = updateUserBody

    // const result = await User.updateOne({ "experiences._id": req.params.expId }, {
    //     '$set': {
    //         'experiences.$[]': req.body
    //     }
    // }) 

    const newData = {};

    for  ( const eachField in newBody){
        newData["selectedTasks.$." + eachField] = newBody[ eachField ];
    }

        const updateUserDetails = await UserModel.updateOne({ _id: req.user._id,
            "selectedTasks.taskId": req.params.id
      }, 
      { $set: newData }, {new: true}
      )

        res.send(submitResult.attemptedBy)

});






export default router;
import { Router, json } from "express";
import { UserModel, TaskModel } from "../model";
import passport from "passport";

import { onlyAdmin, getGeo, onlyDeveloper, getNewGeo } from "../middleware";
import mongoose from "mongoose";

const router = Router();

router.post(
    "/admin",
    passport.authenticate("jwt"),
    onlyAdmin,
    getNewGeo,
    async (req, res) => {
        try {
            const { username } = req.user;
            const usernameExists = await UserModel.findOne({ username }); //destructuring, since it shouldbe  ({  username : username })
            if (!usernameExists)
                res.status(404).send({
                    msg: ` Username : ${username} does not exist`,
                });

            let {
                postedby = new mongoose.Schema.Types.ObjectId(postedby),
            } = req.body;

            // const cityName =  await getGeo(req.body.city);
            // const geoLo = Object.values(cityName)

            let body = { ...req.body, username };

            // console.log(req.body);

            let newTask = await TaskModel.create(body);
            newTask = await newTask
                .populate({
                    path: "postedby",
                    select: "username email firstname surname",
                })
                .execPopulate();

            // console.log(geoLocation)

            res.send(newTask);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    }
);

// Sort tasks according to Roles (==> show all tasks to Admin; task ===company_id to the company;  for Dev--> show all tasks with "approvedByAdmin == true"

router.get(
    "/approvedtasks",
    passport.authenticate("jwt"),
    onlyDeveloper,
    async (req, res) => {
        try {
            const selectedTask = await TaskModel.find({
                approvedByAdmin: true,
            }).populate({
                path: "selectedTasks.taskId",
                select: "username email firstname surname",
            });
            res.send({ total: selectedTask.length, selectedTask });
        } catch (error) {
            res.status(500).send(error);
        }
    }
);

router.get(
    "/developer/query",
    passport.authenticate("jwt"),
    onlyDeveloper,
    async (req, res) => {
        try {
            const taskTotal = await TaskModel.countDocuments();

            const query = req.query;

            const allTasks = await TaskModel.find(query);

            const jsonResult = JSON.parse(JSON.stringify(allTasks));

            const taskWithQuery = jsonResult.filter(
                ({ approvedByAdmin }) => approvedByAdmin
            );

            // const adminAllowedIt = await TaskModel.find({
            //     approvedByAdmin: false,
            // });

            // const newQuery = adminAllowedIt.find(query);

            // console.log(newQuery);

            if (taskTotal <= 0) {
                res.status(404).send({ message: "No Task found" });
            }

            if (query.lat && query.lng) {
                const tasksWithNearDistance = await TaskModel
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

                    .aggregate()
                    .near({
                        near: {
                            type: "Point",
                            coordinates: [
                                parseFloat(req.query.lat),
                                parseFloat(req.query.lng),
                            ],
                        },
                        maxDistance: 1000000,
                        spherical: true,
                        distanceField: "distance",
                    });

                const jsonResult = JSON.parse(
                    JSON.stringify(tasksWithNearDistance)
                );

                const taskWithinDistance = jsonResult.filter(
                    ({ approvedByAdmin }) => approvedByAdmin
                );

                res.send({
                    total: taskWithinDistance.length,
                    taskWithinDistance,
                });

                // res.send({
                //     total: tasksWithNearDistance.length,
                //     tasksWithNearDistance,
                // });
            } else {
                res.send({ total: taskWithQuery.length, taskWithQuery });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ err: error });
        }
    }
);

router.put(
    "/submission/:id",
    passport.authenticate("jwt"),
    onlyDeveloper,
    async (req, res) => {
        const taskIsValid = await TaskModel.findById(req.params.id);
        if (!taskIsValid) {
            res.status(404).send({ msg: " Task with id does not exist" });
        }

        const { repo } = req.body;

        let submissionDetails = {
            repo,
            deliveryTime: Date.now(),
            userInfo: req.user._id,
        };

        const submitResult = await TaskModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    attemptedBy: submissionDetails,
                },
            },
            { new: true }
        ).populate({
            path: "attemptedBy.userInfo",
            select: "username email firstname surname",
        });

        // I need to check deadline, isTaskCompleted, & submittedOntime from User schema

        let updateUserBody = { isTaskCompleted: true };

        let theUserProfile = await UserModel.findOne({
            "selectedTasks.taskId": req.params.id,
        });
        let deadLine = theUserProfile.selectedTasks[0].deadline; //determining the deadline from the schema

        const deadlineToParse = Date.parse(deadLine); //parse the deadline
        const nowToParse = Date.parse(new Date().toISOString()); //parse current date && time

        Number(deadlineToParse) >= Number(nowToParse) //checking if the now is less than or equal to deadline
            ? (updateUserBody = { ...updateUserBody, submittedOnTime: true }) //updating submittedOntime as True
            : (updateUserBody = { ...updateUserBody, submittedOnTime: false }); // else, updating submittedOntime as false

        const newBody = updateUserBody;
        const newData = {};

        for (const eachField in newBody) {
            newData["selectedTasks.$." + eachField] = newBody[eachField];
        }

        const updateUserDetails = await UserModel.updateOne(
            { _id: req.user._id, "selectedTasks.taskId": req.params.id },
            { $set: newData },
            { new: true }
        );

        res.send(submitResult.attemptedBy);
    }
);

//ApprovedByAdmin router for admin to approve tasks to be shown to the Devs

router.put(
    "/adminApproval/:id",
    passport.authenticate("jwt"),
    onlyAdmin,
    async (req, res) => {
        try {
            const selectedTask = await TaskModel.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        approvedByAdmin: true,
                    },
                },
                { new: true }
            ).populate({
                path: "selectedTasks.taskId",
                select: "username email firstname surname",
            });
            res.send({ total: selectedTask.length, selectedTask });
        } catch (error) {
            res.status(500).send(error);
        }
    }
);

router.get("/test/:id", async (req, res) => {
    let theUserProfile = await UserModel.findOne({
        "selectedTasks.taskId": req.params.id,
    });
    let deadLine = theUserProfile.selectedTasks[0].deadline;
    let nowInISO = new Date().toISOString();
    const nowToParse = Date.parse(new Date().toISOString());
    console.log(nowToParse);
    res.send(deadLine);
});

router.get(
    "/admin",
    passport.authenticate("jwt"),
    onlyAdmin,
    async (req, res) => {
        try {
            const taskTotal = await TaskModel.countDocuments();

            const allTasks = await TaskModel.find({});

            res.send({ total: taskTotal, allTasks });
        } catch (error) {
            console.log(error);
            res.status(500).send({ err: error });
        }
    }
);

export default router;

import { Router } from 'express';
import { UserModel } from '../model';
import { TaskModel } from '../model';
import passport from 'passport';
import { onlyAdmin } from '../middleware'

const router = Router()

router.post('/select/:taskId', passport.authenticate('jwt'), async (req, res) => {
    try {
        const selectedTask = await TaskModel.findById(req.params.taskId)
        let today = new Date()
        let dateInMilsc = today.setDate(new Date().getDate() + selectedTask.timeFrame)
        let deadline = new Date(dateInMilsc)
        console.log(deadline)
        let task = {
            taskId: req.params.taskId,
            deadline
        }

        let addTask = await UserModel.findByIdAndUpdate(req.user._id, {
            $push: {
                selectedTasks: task
            }
        }, {
            new: true
        }).populate({ path: "selectedTasks.taskId", model: "tasks" });

        res.send(addTask.selectedTasks)

    } catch (error) {
        res.status(500).send(error);
    }

});

router.post('/submit/:taskId', async (req, res) => {

});

router.get('/:taskId', async (req, res) => {

});

router.get('/', passport.authenticate('jwt'), async (req, res) => {
    try {
        const selectedTask = await UserModel.findById(req.user._id).populate({ path: "selectedTasks.taskId", model: "tasks" });
        res.send(selectedTask)
    } catch (error) {
        res.status(500).send(error)
    }
});

export default router

import {Router} from 'express';
import {UserModel} from '../model';
import passport from 'passport';
import {onlyAdmin} from '../middleware'

const router = Router()

router.get("/:username",passport.authenticate('jwt'), async (req, res) => {
    try {
        const requestedUser = await UserModel.findOne({ username: req.params.username }) || {}
        if (!Object.keys(requestedUser).length)
            throw `${req.params.username} not found`
        res.send(requestedUser)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get("/",passport.authenticate('jwt'), onlyAdmin,  async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.put('/:username', passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.params.username !== req.user.username)
            throw `unauthorized to edit ***** ${req.params.username} ***** profile`
        delete req.body._id;
        const userProfile = await UserModel.findOneAndUpdate({ username: req.user.username }, {
            $set: {
                ...req.body
            }
        }, { new: true });

        res.send(userProfile)
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/:username', passport.authenticate('jwt'), async (req, res) => {
    try {
        if (req.params.username !== req.user.username)
            throw `unauthorized to edit ***** ${req.params.username} ***** profile`
       await user.findOneAndDelete({ username: req.user.username }, { new: true });
        res.send('deleted')
    } catch (error) {
        res.status(500).send(error) 
    }
});

export default router

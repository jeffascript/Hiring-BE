import {Router} from 'express';
import {UserModel} from '../model';
import passport from 'passport';
import {onlyAdmin,onlyDeveloper} from '../middleware'


const router = Router()



export default router

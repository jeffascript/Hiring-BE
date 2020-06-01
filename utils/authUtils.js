import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local'
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as LinkedInStrategy} from 'passport-linkedin-oauth2'
import {UserModel} from '../model';
import dotenv from 'dotenv';
dotenv.config();

/**
 * set and extract in req.user session
 */

passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

/**
 * Local stratedy
*/

passport.use(new LocalStrategy(UserModel.authenticate()))

/**
 * Jwt strategy
*/
passport.use(new JwtStrategy({jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey:process.env.JWT_SECRET},(jwtPayload,next) => {
    UserModel.findById(jwtPayload._id, (err, user) => {
        if (err) return next(err, null)
        else if (user) return next(null, user)
        else return next(null, false)
    })
}))

/** 
 * 
 * Linkedin strategy
 * 
*/

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_KEY,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL: "http://localhost:5500/api/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
  }, (accessToken, refreshToken, profile, done) => {
      console.log(profile)
   
  }));
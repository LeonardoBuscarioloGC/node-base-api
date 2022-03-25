import passport from "passport";
import { Request, Response, NextFunction } from 'express';
import {BasicStrategy} from 'passport-http';
import {User} from '../models/User';

const notAuthorizedJson = {status: 401, message: 'Não Autorizado'};

passport.use(new BasicStrategy(async (email, password, done) => {
    if (email && password) {
        const user = await User.findOne({
            where: {email:email, password: password}
        });
        
        if(user) {
            return done(null, user);
        }
    }
    return done(notAuthorizedJson, false);
}));

export const privateRoute = (req: Request, res: Response, next: NextFunction)  => {
    const authFunction = passport.authenticate('basic', (err, user) => {
        return user ? next() : next(notAuthorizedJson)
    });
    authFunction(req, res, next)
}

export default passport;
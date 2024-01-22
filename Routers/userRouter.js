const express=require('express');
const {signupUser, login, protectRoute, logout}=require('../controller/authController');

const userRouter=express.Router();

userRouter.route('/signup').post(signupUser)
userRouter.route('/login').post(login);

userRouter.use(protectRoute);
userRouter.route('/logout').get(logout);

module.exports=userRouter;
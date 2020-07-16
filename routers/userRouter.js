import express from "express";
import routes from "../routes";
import {
  userDetail,
  getEditProfile,
  getChangePassword,
  postChangePassword,
  postEditProfile,
} from "../controllers/userController";
import { uploadAvatar, onlyPrivate } from "../middlewares";

const userRouter = express.Router();

userRouter.get(routes.userDetail(), userDetail);
userRouter.get(routes.changePassword(), onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword(), onlyPrivate, postChangePassword);
userRouter.get(routes.editProfile(), onlyPrivate, getEditProfile);
userRouter.post(
  routes.editProfile(),
  onlyPrivate,
  uploadAvatar,
  postEditProfile
);

export default userRouter;

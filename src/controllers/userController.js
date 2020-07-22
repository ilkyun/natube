import routes from "../routes";
import User from "../models/User";
import Video from "../models/Video";
import passport from "passport";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    //Register User
    try {
      const user = await User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    //To Do: Log user in
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});
export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, avatar_url: avatarUrl, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};
export const users = (req, res) => res.render("users", { pageTitle: "Users" });

export const getChangePassword = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findById(id);
  res.render("changePassword", { pageTitle: "Change Password", user });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, password, password2 },
  } = req;
  try {
    if (password !== password2) {
      res.status(400);
      res.redirect(routes.changePassword);
      return;
    }
    await req.user.changePassword(oldPassword, password);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(routes.changePassword);
  }
};

export const getMe = async (req, res) => {
  const videos = await Video.find({ _id: req.user.videos }).populate("creator");
  console.log(videos);
  let totalViews = 0;
  let totalLikes = 0;
  videos.forEach((video) => {
    totalViews += video.views;
    totalLikes += video.likes;
  });
  res.render("userDetail", {
    pageTitle: "My Profile",
    user: req.user,
    videos,
    totalViews,
    totalLikes,
  });
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    const videos = await Video.find({ _id: user.videos }).populate("creator");
    console.log(videos);
    let totalViews = 0;
    let totalLikes = 0;
    videos.forEach((video) => {
      totalViews += video.views;
      totalLikes += video.likes;
    });
    res.render("userDetail", {
      pageTitle: "User Details",
      user,
      videos,
      totalViews,
      totalLikes,
    });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditProfile = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    res.render("editProfile", { pageTitle: "Edit Profile", user });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name },
    file,
    params: { id },
  } = req;

  try {
    await User.findOneAndUpdate(
      { _id: id },
      { avatarUrl: file ? file.location : req.user.avatarUrl, name }
    );
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

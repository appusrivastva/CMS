const User = require("../model/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    const { user_name, user_email, user_password, role } = req.body;
    // salting

    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashpwd = await bcrypt.hash(user_password, salt);

    console.log(hashpwd);

    const newUser = new User({
      user_name,
      user_email,
      user_password: hashpwd,
      role,
    });
    await newUser.save();
    console.log(newUser);

    const accesstoken = createAccessToken({ id: newUser._id });
    const refreshtoken = createRefreshToken({ id: newUser._id });
    // refresh token ke liye cookie lelenge jo secure way provide krega taki hum transmit krkske refreshtoken
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/user/refresh_token",
    });

    //  accesstoken send
    res.json({ accesstoken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

(exports.refreshtoken = async (req, res) => {
  try {
    // jb access token jo client pr bheji jb user register krrha h tb lekin kuch time bad user ko jwt expire hojayega refrreshtoken ke help se usko dubara login nhi krna pdega kuch specific time ke liye

    // user ko accesstoken bhejne ke sath uske cookies me hum refreshoken save kra rahe h maan lete h access token expire hogya h toh ab hume refreshtoken ko check krna h ki jo refreshtoken humne save kraya tha kuya vo temper hua h ya nhi
    // usko verify v krenge
    // check 1st refreshtoken h v ya nhi cookies me
    const rf_token = req.cookies.refreshtoken;
    console.log("rf", rf_token);
    if (!rf_token) {
      return res.status(400).json({ msg: "please login and registersss" });
    }
    console.log(rf_token);
    // verify ek check krne vale token ko lega aur us secret key ko lega jisko use kiya gya tha bnate time phir
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "please login or register" });
      const accesstoken = createAccessToken({ id: user.id });
      res.json({ user, accesstoken, rf_token });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}),
  // exports.login = async (req, res) => {
  //     // console.log(req.body);

  //   const { user_email, user_password } = req.body;
  //   console.log(user_password)
  //     const existuser = await User.findOne({ user_email: user_email });
  //     if (!existuser) {
  //       res.json({ msg: "User Does Not Exist!" });
  //   }

  //     const isMatch = await bcrypt.compare(
  //       user_password,
  //       existuser.user_password
  //     );
  //     console.log(isMatch);

  //     if (!isMatch) {
  //       res.status(400).json({ msg: "entered password is incorrect" });
  //     }
  //     // user authenticate krne ke bad uske liye accesstoken create krenge --> ek specific time ke liye aur ek refreshtoken v
  //     const accesstoken = createAccessToken({
  //       id: existuser._id,
  //       role: existuser.role,
  //     });
  //     const refreshtoken = createRefreshToken({
  //       id: existuser._id,
  //       role: existuser.role,
  //     });

  //     // refreshtoken ko send krdenge client ko aur save kr denge cookie me
  //     res.cookie("refreshtoken", refreshtoken, {
  //       httpOnly: true,
  //       path: "/user/refresh_token",
  //     });
  //     res.json({ accesstoken });

  //     // //   res.send("Login successfully");
  //     // res.status(200).json({ message: "Login successful", token });
  //   };
  (exports.login = async (req, res) => {
    try {
      const { user_email, user_password } = req.body;

      // Check if user exists
      const existuser = await User.findOne({ user_email });
      if (!existuser) {
        return res.status(404).json({ msg: "User Does Not Exist!" });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(
        user_password,
        existuser.user_password
      );
      if (!isMatch) {
        return res.status(400).json({ msg: "Entered password is incorrect" });
      }

      // Create tokens
      const accesstoken = createAccessToken({
        id: existuser._id,
        role: existuser.role,
      });
      const refreshtoken = createRefreshToken({
        id: existuser._id,
        role: existuser.role,
      });

      // Send refresh token in cookie
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      // Send access token as response
      res.json({ accesstoken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: error.message });
    }
  });

exports.getUser = async (req, res) => {
  try {
    // Fetch all users from the database
    const allUser = await User.find();

    // Log the result for debugging (optional in production)
    console.log(allUser);

    // Send the response with the list of all users
    res.status(200).json({ allUser });
  } catch (err) {
    // Log the error for debugging
    console.error(err);

    // Send an error response with a meaningful message and status code
    res.status(500).json({
      msg: "An error occurred while fetching users.",
      error: err.message,
    });
  }
};
exports.oneUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    // Fetch the user from the database using the userId
    const user = await User.findById({ _id: user_id }).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user data
    res.status(200).json(user);
  } catch (err) {
    res.json({ msg: err.message });
  }
};
exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", {
      path: "/user/refresh_token",
    });

    res.json({ message: "logout successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// jwt.sign() method create jwt using 3 params 3rd is optional

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// refresh token  use krenge taki secret session vala session expire v hota h tohh v  user ko reauthenticate na krna pda

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

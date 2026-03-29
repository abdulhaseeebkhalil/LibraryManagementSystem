export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,       // required for SameSite=None
      sameSite: "None",   // required for cross-domain (Vercel <-> Render)
    })
    .json({
      success: true,
      message,
      user,
    });
};
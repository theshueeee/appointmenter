import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    
    //saves token in users browser cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        //protects against csrf attacks
        sameSite: "strict",
        //parse the age in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return token;
}
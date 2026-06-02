import asynchandler from "../utils/asynchandler.js";

const registerUser = asynchandler(async (req, res) => {
    res.status(200).json({ message: "User registered successfully" });
});

const loginUser = asynchandler(async (req, res) => {
    res.status(200).json({ message: "User logged in successfully" });
});

export { registerUser, loginUser };
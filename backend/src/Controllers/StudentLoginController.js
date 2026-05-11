import studentModel from "../Models/StudentModel.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

const studentLoginController = {};

studentLoginController.login = async (req, res) => {
  // Se solicitan los daots
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Se valida
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    const studentFound = await studentModel.findOne({ email });
    if (!studentFound) {
      return res.status(400).json({ message: "student not found" });
    }

    // Verificar si el usuario esta bloqueado
    if (studentFound.timeOut && studentFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "acoount blocked" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, studentFound.password);

    if (!isMatch) {
      studentFound.loginAttempts = (studentFound.loginAttempts || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (studentFound.loginAttempts >= 5) {
        studentFound.timeOut = Date.now() + 5 * 60 * 1000;
        studentFound.loginAttempts = 0;

        await studentFound.save();

        return res.status(403).json({
          message: "account blocked",
        });
      }
      await studentFound.save();

      return res.status(400).json({ message: "incorrect password " });
    }

    // Resetear intentos si el login correcto
    studentFound.loginAttempts = 0;
    studentFound.timeOut = null;
    await studentFound.save();

    // Genera el token
    const token = jsonwebtoken.sign(
      // #1 - Que datos vamos a guardar
      { id: studentFound._id, userType: "Student" },
      // #2 - secret key
      config.JWT.SECRET,
      // #3 - cuando expira
      { expiresIn: "30d" },
    );

    // El token lo guardamos en una cookie
    res.cookie("authCookie", token);

    return res.status(200).json({ message: "login successful" });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default studentLoginController;

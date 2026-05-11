import teacherModel from "../Models/teacherModel.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

const teacherLoginController = {};

teacherLoginController.login = async (req, res) => {
  // Se solicitan los daots
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Se valida
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    const teacherFound = await teacherModel.findOne({ email });
    if (!teacherFound) {
      return res.status(400).json({ message: "teacher not found" });
    }

    // Verificar si el usuario esta bloqueado
    if (teacherFound.timeOut && teacherFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "acoount blocked" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, teacherFound.password);

    if (!isMatch) {
      teacherFound.loginAttempts = (teacherFound.loginAttempts || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (teacherFound.loginAttempts >= 5) {
        teacherFound.timeOut = Date.now() + 5 * 60 * 1000;
        teacherFound.loginAttempts = 0;

        await teacherFound.save();

        return res.status(403).json({
          message: "account blocked",
        });
      }
      await teacherFound.save();

      return res.status(400).json({ message: "incorrect password " });
    }

    // Resetear intentos si el login correcto
    teacherFound.loginAttempts = 0;
    teacherFound.timeOut = null;
    await teacherFound.save();

    // Genera el token
    const token = jsonwebtoken.sign(
      // #1 - Que datos vamos a guardar
      { id: teacherFound._id, userType: "teacher" },
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

export default teacherLoginController;

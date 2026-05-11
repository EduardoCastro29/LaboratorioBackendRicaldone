import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import teacherModel from "../Models/teacherModel.js";
import { config } from "../../config.js";

const registerTeacherController = {}; // Array de funciones

registerTeacherController.register = async (req, res) => {
  // Se solicitan los datos
  const { name, lastName, email, password, phone, hireDate, isActive } =
    req.body;

  try {
    const existTeacher = await teacherModel.findOne({ email });
    if (existTeacher) {
      return res.status(400).json({ message: "teacher already exist" });
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    const randomNumber = crypto.randomBytes(3).toString("hex");
    // Se guarda la información en el token
    const token = jsonwebtoken.sign(
      {
        randomNumber,
        name,
        lastName,
        email,
        password: passwordHashed,
        phone,
        hireDate,
        isActive,
      },
      // Se le guarda el secret del jwt
      config.JWT.SECRET,
      // Tiempo de expiración
      { expiresIn: "15m" },
    );
    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    // Se envia por correo electrónico el código aleatorio
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // mailOptions quien lo recibe
    const mailOption = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de cuenta",
      text:
        "Verificar tu cuenta,Utiliza este código: " +
        " " +
        randomNumber +
        " " +
        " Expira en 15 minutos",
    };

    // Enviar el correo
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "error sending emal" });
      }
      return res.status(200).json({ message: "email sent" });
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// Verificar el código que se envio
registerTeacherController.verifyCode = async (req, res) => {
  try {
    // Se solicita el código que se escribe front
    const { verificationCodeRequest } = req.body;
    //Obtener el token de la cookie
    const token = req.cookies.registrationCookie;
    //Extraer información del token
    const decoded = jsonwebtoken.verify(token, config.JWT.SECRET);
    const {
      randomNumber: storedCode,
      name,
      lastName,
      email,
      password: passwordHashed,
      phone,
      hireDate,
      isActive,
    } = decoded;
    // Comparar lo que el usuaio escribio
    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "invalid code" });
    }
    // Si todo esta bien, se registra en la BD
    const newTeacher = teacherModel({
      name,
      lastName,
      email,
      password: passwordHashed,
      phone,
      hireDate,
      isActive,
    });
    await newTeacher.save();
    res.clearCookie("registrationCookie");
    return res.status(200).json({ message: "teacher register" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default registerTeacherController;

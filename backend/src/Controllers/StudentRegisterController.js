import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import studentModel from "../Models/StudentModel.js";
import { config } from "../../config.js";

const registerStudentController = {}; // Array de funciones

registerStudentController.register = async (req, res) => {
  // Se solicitan los datos
  const {
    name,
    lastName,
    email,
    password,
    birthdate,
    speciality_id,
    carnet,
    phone,
  } = req.body;

  try {
    const existStudent = await studentModel.findOne({ email });
    if (existStudent) {
      return res.status(400).json({ message: "student already exist" });
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
        birthdate,
        speciality_id,
        carnet,
        phone,
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
registerStudentController.verifyCode = async (req, res) => {
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
      birthdate,
      speciality_id,
      carnet,
      phone,
      isVerified,
    } = decoded;
    // Comparar lo que el usuaio escribio
    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "invalid code" });
    }
    // Si todo esta bien, se registra en la BD
    const newStudent = studentModel({
      name,
      lastName,
      email,
      password: passwordHashed,
      birthdate,
      speciality_id,
      carnet,
      phone,
      isVerified:true,
    });
    await newStudent.save();
    res.clearCookie("registrationCookie");
    return res.status(200).json({message:"student register"});
  } catch (error) {
    console.log("error"+error);
    return res.status(500).json({message: "internal server error"});
  }
};

export default registerStudentController;

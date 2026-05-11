import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { config } from "../../config.js";
import studentModel from "../Models/StudentModel.js";

// El array de funciones
const studentRecoveryPasswordController = {};

studentRecoveryPasswordController.requestCode = async (req, res) => {
  try {
    // Solicitar los datos
    const { email } = req.body;

    // Validar que el correo exista en la base de datos
    const studentFound = await studentModel.findOne({ email });

    if (!studentFound) {
      return res.status(400).json({ message: "student not found" });
    }

    // Se genera el codigo aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    // Se guardar el token
    const token = jsonwebtoken.sign(
      // ¿Que se va a guardar
      { email, randomCode, userType: "student", verified: false },
      // La clave secreta se ingresa
      config.JWT.SECRET,
      //En cuanto tiempo expira
      { expiresIn: "15m" },
    );
    // El tiempo que en que la cookie se restablecera
    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    //Enviar el correo con el codigo aleatorio

    // Pasos para enviar el correo #1 ¿Quien lo envia?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email, // Se tiene acceso al correo
        pass: config.email.user_password, // Se tiene acceso a la contraseña
      },
    });

    // #2 mailOptions -> quien lo envia y como
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Codigo de recuperación",
      text:
        "Verificar tu cuenta,Utiliza este código: " +
        " " +
        randomCode +
        " " +
        " Expira en 15 minutos",
    };

    // #3 Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(200).json({ message: "error sending email" });
      }
    });
    return res.status(200).json({ message: "email sent" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

studentRecoveryPasswordController.verifyCode = async (req, res) => {
  try {
    //Solicitamos los datos
    const { code } = req.body;

    // Se obtiene la informacion que esta dentro del token

    // Se accede a la cookie
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.SECRET);

    // Lo siguiente es comparar el codigo que el usuario escribio
    // Con el que esta dentro del token
    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "invalid code" });
    }

    // En cambio si escribe bien el codigo
    // Se va a colocar en el token que ya esta verificado
    const newToken = jsonwebtoken.sign(
      // Que vamos a guardar
      { email: decoded.email, userType: "student", verified: true },
      // La clave secreta
      config.JWT.SECRET,
      // En cuanto expira
      { expiresIn: "15m" },
    );
    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });
    return res.status(200).json({ message: "code verified succesfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

studentRecoveryPasswordController.newPassword = async (req, res) => {
  try {
    // Solicito los datos
    const { newPassword, confirmNewPassword } = req.body;
    // Se comparan las respuestas
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "password does not match" });
    }
    // Se va a comprobar que en la constante verified que esta en el token
    // Ya este en true(Osea que haya pasado por el paso2)
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.SECRET);
    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);
    // Actualizar la contraseña en la base de datos
    await studentModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default studentRecoveryPasswordController;

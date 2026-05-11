import teacherModel from "../Models/teacherModel.js";

const teacherController = {}; // Array de funciones

//Función del SELECT GET
teacherController.getTeacher = async (req, res) => {
  try {
    const teachers = await teacherModel.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

teacherController.updateTeacher = async (req, res) => {
  try {
    // Se solicitan los datos
    let { name, lastName, email, password, phone, hireDate, isActive } =
      req.body;

    // Validaciones
    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim();
    phone = phone?.trim();

    // Validaciones de los campos requeridos
    if (!name || !lastName || !email || !password || !hireDate || !phone) {
      return res.status(400).json({ message: "fields required" });
    }
    // Validación de fecha de contratación
    if (hireDate > new Date() || hireDate < new Date("1900-01-01")) {
      return res.status(400).json({ message: "invalid date" });
    }

    const teacherUpdate = await teacherModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        phone,
        hireDate,
        isActive,
      },
      {
        new: true,
      },
    );
    if (!teacherUpdate) {
      return res.status(404).json({ message: "teacher not found" });
    }
    return res.status(200).json({ message: "teacher updated" });
  } catch (errror) {
    console.log("error" + errror);
    return res.status(500).json({ message: "internal server error" });
  }
};

teacherController.deleteTeacher = async (req, res) => {
  try {
    const deleteTeacher = await teacherModel.findByIdAndDelete(req.params.id);
    if (!deleteTeacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    return res.status(200).json({ message: "teacher deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default teacherController;

import studentModel from "../Models/StudentModel.js";

const studentController = {}; // Array de funciones

//Función del SELECT GET
studentController.getStudent = async (req, res) => {
  try {
    const students = await studentModel.find();
    return res.status(200).json(students);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

studentController.updateStudent = async (req, res) => {
  try {
    // Se solicitan los datos
    let {
      name,
      lastName,
      email,
      password,
      birthdate,
      speciality_id,
      carnet,
      phone
    } = req.body;
  } catch (errror) {}
};

studentController.deleteStudent = async (req, res) => {
  try {
    const deleteStudent = await studentModel.findByIdAndDelete(req.params.id);
    if (!deleteStudent) {
      return res.status(404).json({ message: "student not found" });
    }
    return res.status(200).json({ message: "student deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

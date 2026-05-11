import subjectModel from "../Models/SubjectsModel.js";

const subjectController = {}; // Array de funciones

//Función del SELECT GET
subjectController.getSubject = async (req, res) => {
  try {
    const subjects = await subjectModel.find();
    return res.status(200).json(subjects);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// Metódo POST
subjectController.insertSubject = async (req, res) => {
  // #1- Se solicitan los datos a guardar
  const { subjectName, teacher_id, isAvailable } = req.body;

  //#2- Se llenan el modelo con estos datos
  const newSubject = new subjectModel({ subjectName, teacher_id,isAvailable });

  //#3- Se guardan los datos en la base de datos
  await newSubject.save();

  res.json({ message: "subject save" });
};

// Metódo PUT
subjectController.updateSubject = async (req, res) => {
  try {
    // Se solicitan los datos
    let { subjectName, teacher_id, isAvailable  } = req.body;

    // Validaciones
    subjectName = subjectName?.trim();

    // Validaciones de los campos requeridos
    if (!subjectName || !isAvailable || !teacher_id) {
      return res.status(400).json({ message: "fields required" });
    }

    const subjectUpdate = await subjectModel.findByIdAndUpdate(
      req.params.id,
      {
         subjectName, teacher_id, isAvailable
      },
      {
        new: true,
      },
    );
    if (!subjectUpdate) {
      return res.status(404).json({ message: "subject not found" });
    }
    return res.status(200).json({ message: "subject updated" });
  } catch (errror) {
    console.log("error" + errror);
    return res.status(500).json({ message: "internal server error" });
  }
};

subjectController.deleteSubject = async (req, res) => {
  try {
    const deleteSubject = await subjectModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteSubject) {
      return res.status(404).json({ message: "subject not found" });
    }
    return res.status(200).json({ message: "subject deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default subjectController;

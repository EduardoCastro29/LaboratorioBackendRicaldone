import specialtieModel from "../Models/SpecialtiesModel.js";

const specialtieController = {}; // Array de funciones

//Función del SELECT GET
specialtieController.getEspecialtie = async (req, res) => {
  try {
    const specialties = await specialtieModel.find();
    return res.status(200).json(specialties);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// Metódo POST
specialtieController.insertSpecialtie = async (req, res) => {
  // #1- Se solicitan los datos a guardar
  const { specialtyName, isAvailable } = req.body;

  //#2- Se llenan el modelo con estos datos
  const newSpecialtie = new specialtieModel({ specialtyName, isAvailable });

  //#3- Se guardan los datos en la base de datos
  await newSpecialtie.save();

  res.json({ message: "specialtie save" });
};

// Metódo PUT
specialtieController.updateSpecialtie = async (req, res) => {
  try {
    // Se solicitan los datos
    let { specialtyName, isAvailable } = req.body;

    // Validaciones
    specialtyName = specialtyName?.trim();

    // Validaciones de los campos requeridos
    if (!specialtyName || !isAvailable) {
      return res.status(400).json({ message: "fields required" });
    }

    const specialtieUpdate = await specialtieModel.findByIdAndUpdate(
      req.params.id,
      {
        specialtyName,
        isAvailable,
      },
      {
        new: true,
      },
    );
    if (!specialtieUpdate) {
      return res.status(404).json({ message: "specialtie not found" });
    }
    return res.status(200).json({ message: "specialtie updated" });
  } catch (errror) {
    console.log("error" + errror);
    return res.status(500).json({ message: "internal server error" });
  }
};

specialtieController.deleteSpecialtie = async (req, res) => {
  try {
    const deleteSpecialtie = await specialtieModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteSpecialtie) {
      return res.status(404).json({ message: "specialtie not found" });
    }
    return res.status(200).json({ message: "specialtie deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default specialtieController;

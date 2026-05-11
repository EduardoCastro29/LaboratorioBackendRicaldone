import tuitionModel from "../Models/TuitionModel.js";

const tuitionController = {}; // Array de funciones

//Función del SELECT GET
tuitionController.getTuition = async (req, res) => {
  try {
    const tuitions = await tuitionModel.find();
    return res.status(200).json(tuitions);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// Metódo POST
tuitionController.insertTuition = async (req, res) => {
  // #1- Se solicitan los datos a guardar
  const { student_id,amount,paymentDate,method,status,referenceNumber} = req.body;

  //#2- Se llenan el modelo con estos datos
  const newTuition = new tuitionModel({ student_id,amount,paymentDate,method,status,referenceNumber});

  //#3- Se guardan los datos en la base de datos
  await newTuition.save();

  res.json({ message: "tuition save" });
};

// Metódo PUT
tuitionController.updateTuition = async (req, res) => {
  try {
    // Se solicitan los datos
    let { student_id,amount,paymentDate,method,status,referenceNumber } = req.body;

   

    // Validaciones de los campos requeridos
    if (!student_id || !amount) {
      return res.status(400).json({ message: "fields required" });
    }

    const tuitionUpdate = await tuitionModel.findByIdAndUpdate(
      req.params.id,
      {
        student_id,amount,paymentDate,method,status,referenceNumber 
      },
      {
        new: true,
      },
    );
    if (!tuitionUpdate) {
      return res.status(404).json({ message: "tuition not found" });
    }
    return res.status(200).json({ message: "tuition updated" });
  } catch (errror) {
    console.log("error" + errror);
    return res.status(500).json({ message: "internal server error" });
  }
};

tuitionController.deleteTuition = async (req, res) => {
  try {
    const deleteTuition = await tuitionModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteTuition) {
      return res.status(404).json({ message: "tuition not found" });
    }
    return res.status(200).json({ message: "tuition deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default tuitionController;

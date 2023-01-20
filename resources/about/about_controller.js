import { About } from "./about_model.js";

const getAbout = async (req, res) => {
  try {
    const data = await About.find();
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateAbout = async (req, res) => {
  try {
    const data = await About.find();
    if (!data[0]) {
      const add = await About.create({ ...req.body });
    } else {
      const update = await About.findByIdAndUpdate(
        data[0]._id,
        { ...req.body },
        { new: true }
      );
    }
    res.status(200).json({ message: "About updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export { getAbout, updateAbout };

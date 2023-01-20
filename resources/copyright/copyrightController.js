import { Copyright } from "./copyrightModel.js";
import { sendRes } from "../../util/sendResponse.js";

const getCopyright = async (req, res) => {
  try {
    const data = await Copyright.find();
    res.status(200).json(data[0]);
  } catch (e) {
    sendRes(500, false, 'Something went wrong', res)
  }
};

const updateCopyright = async (req, res) => {
  try {
    const data = await Copyright.find();
    if (!data[0]) {
      const add = await Copyright.create({ ...req.body });
    } else {
      const update = await Copyright.findByIdAndUpdate(
        data[0]._id,
        { ...req.body },
        { new: true }
      );
    }
    res.status(200).json({ message: "Copyright updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export { getCopyright, updateCopyright };

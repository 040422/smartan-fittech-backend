import { SQL } from "../models/sqlModel.js";

export const getAllPoses = (req, res) => {
  try {
    const data = SQL.getAll();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};

export const getPoseById = (req, res) => {
  try {
    const { id } = req.params;
    const pose = SQL.getById(id);
    
    if (!pose) {
      return res.status(404).json({ error: "Pose not found" });
    }

    return res.json(pose);
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};

export const updatePose = (req, res) => {
  try {
    const { id } = req.params;
    const { keypoints } = req.body;

    SQL.update(id, JSON.stringify(keypoints));

    return res.json({ message: "Pose updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};

export const deletePose = (req, res) => {
  try {
    const { id } = req.params;

    SQL.delete(id);

    return res.json({ message: "Pose deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};


export const loadModel = async () => {
  console.log("Simulated MediaPipe Pose model loaded successfully.");
};


export const extractKeypoints = async (imagePath) => {
  const keypoints = [];

  for (let i = 0; i < 33; i++) {
    keypoints.push({
      x: Math.random(),          
      y: Math.random(),
      z: Math.random(),
      visibility: Math.random()
    });
  }

  return keypoints;
};

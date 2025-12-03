import ModulesDao from "./dao.js";
export default function ModulesRoutes(app, db) {
console.log("ModulesRoutes loaded");
  const dao = ModulesDao(db);
const findModulesForCourse = async (req, res) => {
  console.log("HIT /api/courses/:courseId/modules with", req.params.courseId);
  const modules = await dao.findModulesForCourse(req.params.courseId);
  console.log("Modules to return:", modules);
  res.json(modules);
};
  const createModuleForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const moduleData = { ...req.body };

    const newModule = await dao.createModule(courseId, moduleData);
    res.send(newModule);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).json({ error: "Failed to create module" });
  }
};
  const deleteModule = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const status = await dao.deleteModule(courseId, moduleId);
  res.send(status);
}

const updateModule = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
    res.send(status);
  }


  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId",deleteModule);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}

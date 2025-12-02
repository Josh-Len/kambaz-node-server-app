import ModulesDao from "./dao.js";
export default function ModulesRoutes(app, db) {
console.log("ModulesRoutes loaded");
  const dao = ModulesDao(db);
const findModulesForCourse = (req, res) => {
  console.log("HIT /api/courses/:courseId/modules with", req.params.courseId);
  const modules = dao.findModulesForCourse(req.params.courseId);
  console.log("Modules to return:", modules);
  res.json(modules);
};
  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const moduleData = {
      ...req.body,
      course: courseId,
    };
    const newModule = dao.createModule(moduleData);
    res.send(newModule);
  }
  const deleteModule = (req, res) => {
  const { moduleId } = req.params;
  const status = dao.deleteModule(moduleId);
  res.send(status);
}

const updateModule = async (req, res) => {
  const { moduleId } = req.params;
  const moduleUpdates = req.body;
  const status = await dao.updateModule(moduleId, moduleUpdates);
  res.send(status);
}

  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}

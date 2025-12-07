import UsersDao from "./dao.js";
export default function UserRoutes(app) {
 const dao = UsersDao();
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

    const deleteUser = async (req, res) => {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
        if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
      const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => { 
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    // Fetch the updated user from the database
    const updatedUser = await dao.findUserById(userId);
    const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
   if (currentUser && currentUser._id === userId) {
     if (req.tabSession) {
       req.tabSession.currentUser = updatedUser;
       req.tabSession.lastAccess = Date.now();
     } else {
       req.session["currentUser"] = updatedUser;
     }
   }
    res.json(updatedUser);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    if (req.tabSession) {
      req.tabSession.currentUser = currentUser;
      req.tabSession.lastAccess = Date.now();
    } else {
      req.session["currentUser"] = currentUser;
    }
    res.json(currentUser);
  };

  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      if (req.tabSession) {
        req.tabSession.currentUser = currentUser;
        req.tabSession.lastAccess = Date.now();
      } else {
        req.session["currentUser"] = currentUser;
      }
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const profile = async (req, res) => {
    const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (req.tabSession) {
      req.tabSession.lastAccess = Date.now();
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    if (req.tabSession) {
      req.tabSession.currentUser = null;
      req.tabSession.lastAccess = Date.now();
    } else {
      req.session.destroy();
    }
    res.sendStatus(200);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}

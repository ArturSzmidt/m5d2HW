import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';

const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);
const currentFolderPath = dirname(currentFilePath);

const usersJSONPath = join(currentFolderPath, 'users.json');

authorsRouter.get('/', (req, res) => {
  const usersJSONContent = fs.readFileSync(usersJSONPath);
  const contentASJSON = JSON.parse(usersJSONContent);
  res.send(contentASJSON);
});

authorsRouter.get('/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersJSONPath));

  console.log(users);

  const user = users.find((u) => u._id === req.params.id);

  res.send(user);
});

authorsRouter.post('/', (req, res) => {
  const newUser = { ...req.body, _id: uniqid(), createdAt: new Date() };

  const users = JSON.parse(fs.readFileSync(usersJSONPath));

  users.push(newUser);

  fs.writeFileSync(usersJSONPath, JSON.stringify(users));

  res.status(201).send({ _id: newUser._id });
});

authorsRouter.put('/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersJSONPath));

  const remainingUsers = users.filter((user) => user._id !== req.params.id);

  const modifiedUser = { ...req.body, _id: req.params.id };

  remainingUsers.push(modifiedUser);

  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers));

  res.send(modifiedUser);
});

authorsRouter.delete('/:id', (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersJSONPath));

  const remainingUsers = users.filter((user) => user._id !== req.params.id); // ! = =

  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers));

  res.status(204).send();
});

export default authorsRouter;

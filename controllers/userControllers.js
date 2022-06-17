import uniqid from "uniqid";
import { parseUsers, writeUser } from "../fileSystem/utils.js";

const getUserObj = (users, id) => {
  return users.users.find((user) => user.id === id);
};
const getUserIndex = (users, id) => {
  return users.users.findIndex((user) => user.id === id);
};
const addUser = (req, res) => {
  const users = parseUsers();
  const uniqId = uniqid();
  const { cash = 0, credit = 0 } = req.body;
  const data = { id: uniqId, cash, credit, isActive: true };
  users.users.push(data);
  writeUser(users);
  res.send(`User added successfully`);
};

const depositUser = (req, res) => {
  const users = parseUsers();
  const { id } = req.params;
  const { cash = 0 } = req.body;
  try {
    const user = getUserObj(users, id);
    if (!user) {
      throw new Error(`There is no user with the ID ${id} in the database`);
    }
    if (user.isActive === false) {
      throw new Error(`The user is not active`);
    }
    const updatedUser = { ...user, cash: user.cash + cash };
    users.users[getUserIndex(users, id)] = updatedUser;
    writeUser(users);
    res.send(`Deposit successfully`);
  } catch (error) {
    res.send(error.toString());
  }
};

const creditUser = (req, res) => {
  const users = parseUsers();
  const { id } = req.params;
  const { credit = 0 } = req.body;
  try {
    const user = getUserObj(users, id);
    if (!user) {
      throw new Error(`There is no user with the ID ${id} in the database`);
    }
    if (user.isActive === false) {
      throw new Error(`The user is not active`);
    }
    if (credit < 0) {
      throw new Error(`Credit must be a positive number`);
    }
    const updatedUser = { ...user, credit: credit };
    users.users[getUserIndex(users, id)] = updatedUser;
    writeUser(users);
    res.send(`Credit updated successfully`);
  } catch (error) {
    res.send(error.toString());
  }
};

const withdrawUser = (req, res) => {
  const users = parseUsers();
  const { id, amount } = req.params;
  try {
    const user = getUserObj(users, id);
    if (!user) {
      throw new Error(`There is no user with the ID ${id} in the database`);
    }
    if (user.isActive === false) {
      throw new Error(`The user is not active`);
    }
    const availableMoney = user.cash + user.credit;
    if (availableMoney < amount) {
      throw new Error(
        `User doesn't have enough money to withdraw ${amount} USD`
      );
    }
    let newCash = user.cash;
    let newCredit = user.credit;
    if (amount > user.cash) {
      newCredit -= amount - newCash;
      newCash = 0;
    } else {
      newCash -= amount;
    }
    const updatedUser = { ...user, credit: newCredit, cash: newCash };
    users.users[getUserIndex(users, id)] = updatedUser;
    writeUser(users);
    res.send(`Withdraw successfully`);
  } catch (error) {
    res.send(error.toString());
  }
};

const transferUsers = (req, res) => {
  const users = parseUsers();
  const { fid = "", sid = "", amount = 0 } = req.body;
  try {
    const firstUser = getUserObj(users, fid);
    if (!firstUser) {
      throw new Error(`There is no user with the ID ${fid} in the database`);
    }
    const secondUser = getUserObj(users, sid);
    if (!secondUser) {
      throw new Error(`There is no user with the ID ${sid} in the database`);
    }
    if (fid === sid) {
      throw new Error(`Please use different users to transfer money between`);
    }
    if (firstUser.isActive === false) {
      throw new Error(`The user with the ID ${sid} is not active`);
    }
    if (secondUser.isActive === false) {
      throw new Error(`The user with the ID ${sid} is not active`);
    }
    const availableMoney = firstUser.cash + firstUser.credit;
    if (availableMoney < amount) {
      throw new Error(
        `First user doesn't have enough money to withdraw ${amount} USD and transfer to the second user`
      );
    }
    let newCash = firstUser.cash;
    let newCredit = firstUser.credit;
    if (amount > firstUser.cash) {
      newCredit -= amount - newCash;
      newCash = 0;
    } else {
      newCash -= amount;
    }
    const updatedFirstUser = { ...firstUser, credit: newCredit, cash: newCash };
    const updatedSecondUser = {
      ...secondUser,
      cash: secondUser.cash + amount,
    };
    users.users[getUserIndex(users, fid)] = updatedFirstUser;
    users.users[getUserIndex(users, sid)] = updatedSecondUser;
    writeUser(users);
    res.send(`Transfer successfully`);
  } catch (error) {
    res.send(error.toString());
  }
};

const getUser = (req, res) => {
  const users = parseUsers();
  const { id } = req.params;
  try {
    const user = getUserObj(users, id);
    if (!user)
      throw new Error(`There is no user with the ID ${id} in the database`);
    else res.send(user);
  } catch (error) {
    res.send(error.toString());
  }
};

const getAllUsers = (req, res) => {
  const users = parseUsers();
  res.send(users.users);
};

const deleteUser = (req, res) => {
  const users = parseUsers();
  const { id } = req.params;
  try {
    const user = getUserObj(users, id);
    if (!user) {
      throw new Error(`There is no user with the ID ${id} in the database`);
    }
    users.users.splice(getUserIndex(users, id), 1);
    writeUser(users);
    res.send(`User deleted successfully`);
  } catch (error) {
    res.send(error.toString());
  }
};
const getAllUsersSorted = (req, res) => {
  const users = parseUsers();
  res.send(users.users.sort((a, b) => b.cash - a.cash));
};

export {
  addUser,
  depositUser,
  creditUser,
  withdrawUser,
  transferUsers,
  getUser,
  getAllUsers,
  deleteUser,
  getAllUsersSorted,
};

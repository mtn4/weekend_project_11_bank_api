import fs from "fs";

const PATH = "./db/data.json";

const parseUsers = () => {
  return JSON.parse(fs.readFileSync(PATH, "utf-8"));
};
const writeUser = (data) => fs.writeFileSync(PATH, JSON.stringify(data));

export { parseUsers, writeUser };

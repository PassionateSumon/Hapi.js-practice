const crypto = require("crypto");
const { users } = require("../Db");
const fs = require("fs");

async function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

async function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
}

exports.addDetails = async (req, res) => {
  try {
    const { name, email, password } = req?.payload;
    const hashedPassword = password ? await hash(password) : "";

    let details = {
      id: Math.floor(Math.random() * 10000000000),
      name,
      email,
      password: hashedPassword,
      message: "Details added successfully!",
    };

    users.push({ id: details.id, name, email, hashedPassword });
    return details;
  } catch (error) {
    console.log(error);
  }
};

exports.showAllDetails = async (req, res) => {
  try {
    let details = {
      users,
      message: "All details fecthed successfully.",
    };
    return details;
  } catch (error) {
    console.log(error);
  }
};

exports.showSingleDetail = async (req, res) => {
  try {
    const { id } = req?.params;
    const ind = users.findIndex((u) => u.id === id);
    let details = {
      userDetail: users[ind],
      message: "Single detail fetched..",
    };
    return details;
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  try {
    const { id, name, email } = req?.payload;
    const updatedUsers = users.map((u) =>
      u.id === id ? { ...u, name: name, email: email } : u
    );

    users = updatedUsers;
    let details = {
      updatedUsers,
      name,
      email,
      message: "Updated successfully..",
    };
    return details;
  } catch (error) {
    console.log(error);
  }
};

exports.fileUpload = async (req, res) => {
  try {
    fs.createWriteStream(
      __dirname + "../../uploads/" + req.payload.file.filename
    );

    let details = {
      message: "File uploaded successfully..",
    };
    return details;
  } catch (error) {
    console.log(error);
  }
};

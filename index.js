import express from "express";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";
import * as fs from "fs";
import { hash, encrypt, decrypt } from "./utils/crypting";
import bodyParser from "body-parser";
const developerToken = "";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.status(200);
  res.json({
    message: "main page",
  });
});

app.get("/new-token", async (req, res) => {
  const devToken = req.headers.authToken; // cooler xD
  const json = {};
  const uid = uuidV4();
  if (devToken === developerToken) {
    try {
      if (fs.existsSync(`${__dirname}/users.json`)) {
        json[req.headers["user-id"]] = hash(uid);
        fs.writeFileSync("./users.json", JSON.stringify(json, null, 4));
        res.status(200);
        res.json({
          message: "success",
        });
      } else {
        const exist = JSON.parse(fs.readFileSync("./users.json"));
        exist[req.headers["user-id"]] = hash(uid);
        fs.writeFileSync("./users.json", JSON.stringify(exist, null, 4));
        res.status(200);
        res.json({
          message: "success",
        });
      }
    } catch {
      res.status(422);
      res.json({
        message: "Unprocessable Entity",
      });
    }
  } else {
    res.status(403);
    res.json({
      message: "forbidden",
    });
  }
});

app.post("/create-user", async (req, res) => {
  const authorization = req.headers.authToken;
  if (authorization === developerToken) {
    const userId = req.body.userId;
    const auth = uuidV4();
    const storeAuth = hash(auth);
    const json = JSON.parse(fs.readFileSync("./users.json"));
    json[userId] = storeAuth;
    fs.writeFileSync("./users.json", JSON.stringify(json));
    res.status(200);
    res.json({
      message: "OK",
    });
  } else {
    res.status(403);
    res.json({
      message: "forbidden",
    });
  }
});

app.get("/get-all-users", (req, res) => {
  const authorization = req.headers.authToken;
  if (authorization === developerToken) {
    const userId = req.body.userId;
    const data = JSON.parse(fs.readFileSync("./users.json"));
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.json({
      message: "OK",
      data,
    });
  } else {
    res.status(403);
    res.json({
      message: "forbidden",
    });
  }
});

app.get("/get-collection", (req, res) => {
  const authorization = req.headers.authToken;
  const authId = req.headers.authId;
  const authCode = hash(authorization);
  const JsonData = JSON.parse(fs.readFileSync("./users.json"));
  if (!JsonData[authId]) {
    res.status(401);
    return res.json({
      message: "Unauthorized",
    });
  }

  if (!JsonData[authId] !== authCode) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }

  const fileSearcher =
    JSON.parse(
      fs.readFileSync(`${__dirname}/${authId}/${req.body.collectionName}.json`)
    ) || undefined;
  if (!fileSearcher) {
    res.status(422);
    return res.json({
      message: "Unprocessable Entity",
    });
  }

  res.status(200);
  return res.json({
    // yo we should use easy-db-json less package = faster okay
    message: "OK",
    data: fileSearcher,
  });
});

app.post("new-collection", (req, res) => {
  const userId = req.headers.authId;
  const authTokenBeforeHash = req.headers.authToken;
  const authToken = hash(authTokenBeforeHash);
  const allUserInformation = JSON.parse(fs.readFileSync("./users.json"));
  const userPass = allUserInformation[userId];
  if (authToken !== userPass) {
    res.status(403);
    res.json({
      message: "Forbidden",
    });
  } else {
    fs.writeFileSync(
      `./database/${userId}/${req.body.dataname}.json`,
      JSON.stringify(req.body.json, null, 4)
    );
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PooPoo DB running on port ${PORT}`);
});

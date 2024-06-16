const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const { Kafka } = require("kafkajs");

//TODO: add credentials here
const s3Client = new S3Client({
  region: "",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
  },
});

const PROJECT_ID = process.env.PROJECT_ID;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;

//connect to kafka
const kafka = new Kafka({
  clientId: `docker-build-server-${DEPLOYMENT_ID}`,
  brokers: [],
  ssl: {},
  sasl: {
    username: "",
    password: "",
    mechanism: "plain",
  },
});

const producer = kafka.producer();

async function publishLOg(log) {
  await producer.send({
    topic: "container-logs",
    messages: [{ key: "log", value: JSON.stringify({ PROJECT_ID, DEPLOYMENT_ID, log }) }],
  });
}

async function init() {
  await producer.connect();

  console.log("Executing script.js");
  const outDirPath = path.join(__dirname, "output");

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout.on("error", async function (data) {
    console.log("Error", data.toString());
    await publishLOg(`error: ${data.toString()}`);
  });

  p.on("close", async function () {
    console.log("Build Complete");
    await publishLOg("Build Complete");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContent = fs.readdirSync(distFolderPath, { recursive: true });

    await publishLOg("Starting to upload");
    for (const file of distFolderContent) {
      const filePath = path.join(distFolderPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;

      console.log("uploadin", filePath);
      await publishLOg(`uploading ${file}`);

      const command = new PutObjectCommand({
        Bucket: "",
        Key: `__outputs/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      await s3Client.send(command);
      await publishLOg(`uploaded ${file}`);
      await publishLOg("uploaded", filePath);
    }
    await publishLOg("Done");
    console.log("Done...");
    process.exit(0);
  });
}

init();

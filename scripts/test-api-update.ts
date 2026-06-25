import fs from "fs";

// Load local environment variables
const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const { readData, writeData } = require("../lib/db");

async function run() {
  const type = "videos";
  const typedData = await readData(type);
  console.log("Original typedData length:", typedData.length);
  if (typedData.length === 0) {
    console.log("No data found.");
    return;
  }

  // Create an update payload similar to client
  const originalItem = typedData[0];
  const payloadItem = {
    ...originalItem,
    title: "Test API Update " + Math.floor(Math.random() * 100)
  };

  console.log("Updating item with ID:", payloadItem.id);
  const updatedData = typedData.map((d: any) => (d.id === payloadItem.id ? payloadItem : d));

  // Let's verify that the item was actually updated in the array
  const checkUpdated = updatedData.find((d: any) => d.id === payloadItem.id);
  console.log("Updated item title in array:", checkUpdated.title);

  await writeData(type, updatedData);
  console.log("writeData completed successfully!");
}

run();

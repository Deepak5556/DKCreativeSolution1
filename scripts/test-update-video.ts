import fs from "fs";

// Load local environment variables
const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

// Now import database helper functions after env is loaded
const { readData, writeData } = require("../lib/db");

async function run() {
  try {
    console.log("Reading videos...");
    const videos = await readData("videos");
    console.log(`Found ${videos.length} videos.`);
    if (videos.length === 0) {
      console.log("No videos to update.");
      return;
    }

    const testVideo = { ...videos[0] } as any;
    console.log("Original video for testing:", testVideo);

    // Modify a field slightly
    testVideo.title = testVideo.title + " (Updated)";
    const updatedList = videos.map((v: any) => v.id === testVideo.id ? testVideo : v);

    console.log("Saving updated videos list...");
    await writeData("videos", updatedList);
    console.log("Successfully wrote videos to database!");
  } catch (err: any) {
    console.error("FAILED to write videos:", err.message || err);
  }
}

run();

import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
  // Take a look at the test.sqlite file and delete it
  try {
    await rm(join(__dirname, "..", "test.sqlite"), { force: true });
  } catch (error) { }
})

import { app } from "./src/server/server.js";

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const http = require("http");
const process = require('process');
const args = process.argv.slice(2);
const portIndex = args.findIndex(arg => arg === '--port');
const port = portIndex !== -1 ? parseInt(args[portIndex + 1]) : 1229;

const fs = require("fs");
let homeContent = "";
let projectContent = "";
let registrationContent="";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if(err) {
    throw err;
  }
  registrationContent=registration;
});

http.createServer((request, response) => {
  let url = request.url;
  response.writeHeader(200, { "Content-Type": "text/html" });
  switch (url) {
    case "/project":
      response.write(projectContent);
      response.end();
      break;

    case "/registration":
      response.write(registrationContent);
      response.end();
      break;

    default:
      response.write(homeContent);
      response.end();
      break;
  }
}).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
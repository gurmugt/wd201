const fs = require("fs");
fs.writeFile(
    "sample.txt",
    "Hello World. Welcome to Node.js File System module.",
    (err) => {
      if (err) throw err;
      console.log("File created!");
    }
  );

//to read file
  fs.readFile("sample.txt", (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  });

//We can use appendFile() to add more content to the file already created.
  fs.appendFile("sample.txt", " This is my updated content", (err) => {
    if (err) throw err;
    console.log("File updated!");
  });

  //We can use rename() to rename an existing file.
  fs.rename("sample.txt", "test.txt", (err) => {
    if (err) throw err;
    console.log("File name updated!");
  });


  //We can use the unlink() to delete the files in the file system.
//   fs.unlink("test.txt", (err) => {
//     if (err) throw err;
//     console.log("File test.txt deleted successfully!");
//   });


//to import a package
//import {ESlint} from "eslint";
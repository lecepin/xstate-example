const dirList = ["1-feedback", "tpl", "tpl-class"];

dirList.map((item) => {
  process.exec(
    `cd ${item} && tnpm i && npm run build && mv build ../build && mv ../build/build ../build/${item}`
  );
});

const indexHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <ul>
      ${dirList
        .map((item) => `<li><a href="${item}">${item}</a></li>`)
        .join("")}      
    </ul>
  </body>
</html>

`;

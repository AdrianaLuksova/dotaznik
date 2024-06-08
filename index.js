const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // pro statické soubory (CSS, JS)
app.set("view engine", "ejs"); // nastavení EJS jako šablonovacího nástroje

/* Routa pro zobrazení úvodní stránky */
app.get("/", (req, res) => {
  res.render("index", { title: "Dotazníček na náhodné otázky" });
});

/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
  const newResponse = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    answers: req.body,
  };

  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let responses = JSON.parse(data);
    responses.push(newResponse);

    fs.writeFile("responses.json", JSON.stringify(responses, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      res.redirect("/results");
    });
  });
});

/* Routa pro zobrazení výsledků ankety */
app.get("/results", (req, res) => {
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('result', { title: "Výsledky dotazníčku", responses });
  });
});

app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

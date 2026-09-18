# Die App des Schulvereins – Anleitung für Natascha

Das hier ist die komplette App. Sie besteht aus ein paar Dateien in einem Ordner.
Wer diesen Ordner ins Internet stellt, hat die App.

## Was liegt in diesem Ordner?

| Datei | Wofür |
|---|---|
| **inhalte.json** | **Alle Texte und Termine. Das ist die einzige Datei, die du je anfassen musst.** |
| index.html | Das Gerüst der Seite |
| app.css | Das Aussehen (Farben, Schrift, Abstände) |
| app.js | Baut die Seite aus `inhalte.json` zusammen |
| manifest.webmanifest | Sagt dem Handy, wie die App heißt und welches Symbol sie hat |
| sw.js | Sorgt dafür, dass die App auch ohne Netz startet |
| icon-192.png, icon-512.png, icon-512-maskable.png | Das App-Symbol |

## Inhalte ändern

`inhalte.json` mit einem Texteditor öffnen (Windows: Editor, Mac: TextEdit) und die
Texte zwischen den Anführungszeichen austauschen. Drei Regeln:

1. Die Anführungszeichen stehen lassen.
2. Das Komma am Zeilenende stehen lassen – außer beim letzten Eintrag eines Blocks.
3. Nach dem Speichern die Datei wieder hochladen. Die App zeigt die Änderung sofort.

### Einen Termin ändern
Im Block `"termine"` stehen die Einträge untereinander. Ein Eintrag sieht so aus:

    {
      "tag": "06",
      "monat": "Nov",
      "titel": "Halloweenparty",
      "zeit": "18 bis 22 Uhr",
      "text": "Für alle Kinder, Kostüme sehr erwünscht.",
      "hinweis": "Bitte beachten: keine Vollmasken ...",
      "status": "Anmeldung offen",
      "knopf": "Zur Anmeldung",
      "formular": "https://form.jotform.com/262572074556058"
    }

### Einen Termin neu dazunehmen
Einen vorhandenen Eintrag samt geschweifter Klammern kopieren, hinter dem letzten
einfügen, davor ein Komma setzen und die Angaben ändern.

### Eine Neuigkeit posten
Im Block `"news"` oben einen Eintrag mit `datum`, `titel` und `text` einfügen.
Die oberste Meldung steht in der App ganz oben.

### Tipp
Wenn nach einer Änderung nichts mehr angezeigt wird, ist meistens ein Komma oder ein
Anführungszeichen verrutscht. Auf **jsonlint.com** kann man die Datei einfügen und sieht
sofort, in welcher Zeile der Fehler steckt.

## Das Logo austauschen

Euer Vereinslogo als `logo.png` in den Ordner legen und in `inhalte.json` im Block
`"verein"` diese Zeile ergänzen:

    "logo": "logo.png",

Für das App-Symbol auf dem Startbildschirm müssen zusätzlich `icon-192.png` und
`icon-512.png` ersetzt werden – gleiche Namen, quadratisch, 192 bzw. 512 Pixel.

## Die App auf den Startbildschirm holen

- **Android (Chrome):** Seite öffnen → Menü ⋮ → *App installieren* bzw.
  *Zum Startbildschirm hinzufügen*
- **iPhone (Safari):** Seite öffnen → Teilen-Symbol → *Zum Home-Bildschirm*

Danach liegt sie wie eine normale App auf dem Handy, mit Symbol und ohne Browserleiste.

## Was die App noch nicht kann

- **Push-Nachrichten.** Die bräuchten zusätzlich einen Dienst im Hintergrund.
  Bei Jotform sind sie eingebaut – hier müssten sie nachgerüstet werden.
- **Geschützter Bereich.** Der Kinoabend ist in der App sichtbar; abgesichert ist nur
  das Formular dahinter.

## Wo die Anmeldungen landen

Die Knöpfe öffnen weiterhin die bestehenden Jotform-Formulare, die Einträge laufen also
in die gewohnte Jotform-Tabelle. Wenn die 100 Einsendungen pro Monat eng werden, tauschen
wir in `inhalte.json` einfach die Adresse hinter `"formular"` gegen ein kostenloses
Tally-Formular aus. An der App selbst ändert sich dafür nichts.

const express = require("express");
const fs = require("fs-extra");
const { exec } = require("child_process");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const { upload } = require("./mega");

const router = express.Router();

const MESSAGE =
  process.env.MESSAGE ||
  `SESSION GENERATED SUCCESSFULLY
DON'T FORGET TO FORK AND STAR THE REPO
https://github.com/Extreamedeone/EXTREAME-XMD
> EXTREAME-XMD`;

let baileys;
let makeWASocket,
  delay,
  DisconnectReason,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  Browsers;

// Load baileys ONCE
(async () => {
  baileys = await import("@whiskeysockets/baileys");
  ({
    default: makeWASocket,
    delay,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
  } = baileys);
})();

router.get("/", async (req, res) => {
  try {
    let number = req.query.number;
    if (!number) {
      return res.status(400).json({ error: "Missing ?number=" });
    }

    number = number.replace(/\D/g, "");

    fs.ensureDirSync("./auth_info_baileys");
    fs.emptyDirSync("./auth_info_baileys");

    const { state, saveCreds } = await useMultiFileAuthState(
      "./auth_info_baileys"
    );

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(
          state.keys,
          pino({ level: "fatal" })
        ),
      },
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Safari"),
      printQRInTerminal: false,
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
      await delay(1000);
      const code = await sock.requestPairingCode(number);
      return res.json({ pairingCode: code });
    }

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "open") {
        try {
          await delay(3000);

          const user = sock.user.id.includes(":")
            ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
            : sock.user.id;

          const megaURL = await upload(
            fs.createReadStream("./auth_info_baileys/creds.json"),
            `session_${Date.now()}.json`
          );

          const scanId = "xtreme~" + megaURL.replace("https://", "");

          const msg = await sock.sendMessage(user, { text: scanId });
          await sock.sendMessage(user, { text: MESSAGE }, { quoted: msg });

          fs.emptyDirSync("./auth_info_baileys");
        } catch (e) {
          console.error("Session send error:", e);
        }
      }

      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log("Connection closed:", DisconnectReason[reason] || reason);
      }
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal error" });
    }
  }
});

module.exports = router;

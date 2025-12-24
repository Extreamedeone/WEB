const express = require("express");
const fs = require("fs-extra");
const { exec } = require("child_process");
const pino = require("pino");
const axios = require("axios");
const router = express.Router();
const { upload } = require("./mega");

const MESSAGE =
  process.env.MESSAGE ||
  `SESSION GENERATED SUCCESSFULLY
DON'T FORGET TO FORK AND STAR THE REPO
https://github.com/Extreamedeone/EXTREAME-XMD
> EXTREAME-XMD`;

const PHONE_NUMBER = "+254791231068";
const GITHUB_AVATAR_URL = "https://github.com/Extreamedeone.png"; // Your GitHub profile picture

(async () => {
  const baileys = await import("@whiskeysockets/baileys");
  const {
    default: makeWASocket,
    delay,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
} = baileys;

  // Clean auth folder at startup
  try {
    fs.emptyDirSync("./auth_info_baileys");
  } catch (err) {
    console.log("Error emptying auth folder:", err);
  }

  router.get("/", async (req, res) => {
    try {
      await startSession(PHONE_NUMBER);
      res.json({ status: "Session started, message sent!" });
    } catch (err) {
      console.log("Fatal error:", err);
      if (!res.headersSent) res.json({ error: "Try again later" });
    }
  });

  async function startSession(number) {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
      },
      logger: pino({ level: "fatal" }),
      browser: Browsers.macOS("Safari"),
      printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "open") {
        try {
          await delay(3000);
          const user = sock.user?.id?.includes(":")
            ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
            : sock.user?.id;

          // Upload GitHub avatar to buffer
          const response = await axios.get(GITHUB_AVATAR_URL, { responseType: "arraybuffer" });
          const imageBuffer = Buffer.from(response.data, "binary");

          // Send your number + GitHub avatar
          await sock.sendMessage(user, {
            image: imageBuffer,
            caption: `Hello! Deploy Your bot now.\n\nIf encountering any problem contact dev ${number} am happy to help\n\n${MESSAGE}`,
          });

          // Cleanup auth folder after sending
          await delay(1000);
          fs.emptyDirSync("./auth_info_baileys");
        } catch (err) {
          console.log("Error sending message:", err);
        }
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode || 0;
        console.log("Connection closed:", DisconnectReason[reason] || reason);

        if (
          reason === DisconnectReason.restartRequired ||
          reason === DisconnectReason.badSession ||
          reason === DisconnectReason.connectionClosed
        ) {
          console.log("Restarting service...");
          exec("pm2 restart qasim");
        }
      }
    });
  }
})();

module.exports = router;

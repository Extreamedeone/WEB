const express = require("express");
const fs = require("fs-extra");
const { exec } = require("child_process");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const router = express.Router();
const { upload } = require("./mega");

const MESSAGE = process.env.MESSAGE || ` SESSION GENERATED SUCCESSFULY DON'T FORGET TO FORK AND STAR THE REPO https:                                                                                                                                                           

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

                                 
  try {
    fs.emptyDirSync("./auth_info_baileys");
  } catch (err) {
    console.log("Error emptying auth folder:", err);
  }

  router.get("/", async (req, res) => {
    let number = req.query.number;
    if (!number) return res.json({ error: "Missing ?number=" });

    try {
      await startSession();
    } catch (err) {
      console.log("Fatal error:", err);
      if (!res.headersSent) res.json({ error: "Try again later" });
    }

    async function startSession() {
      const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
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
        await delay(800);
        number = number.replace(/\D/g, "");
        try {
          const code = await sock.requestPairingCode(number);
          if (!res.headersSent) res.json({ code });
        } catch (err) {
          console.log("Pairing error:", err);
          if (!res.headersSent) res.json({ error: "Failed to request code" });
        }
      }

                           
      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
          try {
            await delay(3000);
            const user = sock.user?.id?.includes(":")
              ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
              : sock.user?.id;
            const randomId = () => {
              const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let base = [...Array(6)].map(
                () => chars[Math.floor(Math.random() * chars.length)]
              ).join("");
              return base + Math.floor(Math.random() * 10000);
            };
            const megaURL = await upload(
              fs.createReadStream("./auth_info_baileys/creds.json"),
              `//github.com/Extreamedeone/EXTREAME-XMD Contact Dev 💭 +254791231068 WA Channel https://whatsapp.com/channel/0029VbAtW9k2P59fxlHdvA1n EXTREAME-XMD🌝 `;

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
    let number = req.query.number;
    if (!number) return res.json({ error: "Missing ?number=" });

    try {
      await startSession();
    } catch (err) {
      console.log("Fatal error:", err);
      if (!res.headersSent) res.json({ error: "Try again later" });
    }

    async function startSession() {
      const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
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

      // Pairing process
      if (!sock.authState.creds.registered) {
        await delay(800);
        number = number.replace(/\D/g, "");
        try {
          const code = await sock.requestPairingCode(number);
          if (!res.headersSent) res.json({ code });
        } catch (err) {
          console.log("Pairing error:", err);
          if (!res.headersSent) res.json({ error: "Failed to request code" });
        }
      }

      // Connection updates
      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
          try {
            await delay(3000);
            const user = sock.user?.id?.includes(":")
              ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
              : sock.user?.id;
            const randomId = () => {
              const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let base = [...Array(6)].map(
                () => chars[Math.floor(Math.random() * chars.length)]
              ).join("");
              return base + Math.floor(Math.random() * 10000);
            };
            const megaURL = await upload(
              fs.createReadStream("./auth_info_baileys/creds.json"),
              `${randomId()}.json`
            );
            const Scan_Id = "xtreme~" + megaURL.replace("https:                      
            const msg = await sock.sendMessage(user, { text: Scan_Id });
            await sock.sendMessage(user, { text: MESSAGE }, { quoted: msg });

                      
            await delay(1000);
            try {
              fs.emptyDirSync("//mega.nz/file/", "");
            const msg = await sock.sendMessage(user, { text: Scan_Id });
            await sock.sendMessage(user, { text: MESSAGE }, { quoted: msg });

            // Cleanup
            await delay(1000);
            try {
              fs.emptyDirSync("./auth_info_baileys");
            } catch (err) {
              console.log("Error emptying auth folder:", err);
            }
          } catch (err) {
            console.log("Error while sending session:", err);
          }
        }

        if (connection === "close") {
          const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
          console.log("Connection closed:", DisconnectReason[reason] || reason);
                                          
          if (
            reason === DisconnectReason.restartRequired ||
            reason === DisconnectReason.badSession ||
            reason === DisconnectReason.connectionClosed
          ) {
            console.log("// Restart only for fatal errors
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
  });
})();

module.exports = router;

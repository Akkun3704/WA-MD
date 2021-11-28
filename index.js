const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys-md')
const P = require('pino')
const util = require('util')
const cp = require('child_process')
let session = `./session.data.json`
const { state, saveState } = useSingleFileAuthState(session)

async function start() {
	
	const conn = makeWASocket({ printQRInTerminal: true, logger: P({ level: 'debug' }), auth: state })
	
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			let shouldReconnect = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
			console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
			if (shouldReconnect) conn = start()
		} else if (connection === 'open') {
			console.log('opened connection')
		}
	})
	
	conn.ev.on('creds.update', () => saveState)
	
	conn.ev.on('messages.upsert', async ({ messages }) => {
		console.log(JSON.stringify(messages, null, 2))
		try {
			if (!messages) return
			let m = messages[0]
			if (!m.message) return
			let from = m.key.remoteJid
			let type = Object.keys(m.message)[0]
			let body = m.message.conversation || m.message[type].caption || m.message[type].text || ['listResponseMessage'].includes(type) && m.message[type].singleSelectReply.selectedRowId || ['buttonsResponseMessage'].includes(type) && m.message[type].selectedButtonId || ''
			let args = body.trim().split(/ +/).slice(1)
			let q = args.join` `
			
			const sendText = (jid, text, quoted, opt) => conn.sendMessage(jid, { text }, { quoted, ...opt })
			
			switch (true) {
				case /^>?> /.test(body): {
					let text
					try {
						text = await eval(`(async () => { ${(/^>>/.test(body) ? 'return ' : '') + q} })()`)
					} catch (e) {
						text = e
					} finally {
						sendText(from, text, msg)
					}
					break
				}
				case /^[$] /.test(body): {
					await conn.sendMessage(from, { text: 'Executing...' }, { quoted: msg })
					let exec = promisify(cp.exec).bind(cp)
					let o
					try {
						o = await exec(q)
					} catch (e) {
						o = e
					} finally {
						let { stdout, stderr } = o
						if (stdout) return sendText(from, stdout, msg)
						if (stderr) return sendText(from, stderr, msg)
					}
					break
				}
				default:
				break
			}
		} catch (e) {
			console.log(e)
		}
	})
}

start()
.catch(console.log)
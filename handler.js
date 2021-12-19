'use strict'
const Baileys = require('@adiwajshing/baileys-md')
const cp = require('child_process')
const axios = require('axios')
const path = require('path')
const got = require('got')
const util = require('util')
const fs = require('fs')

const pkg = require('./package.json')
const simple = require('./lib/simple.js')
const functions = require('./lib/function.js')
const { menu, mess, tos } = require('./lib/txt.js')
const { color, clockString, isUrl, getBuffer, pickRandom, parseResult, uploadFile } = functions

const time = new Date().toLocaleString('es-AR')
const delay = ms => Baileys.delay(ms)

module.exports = {
	async chatUpdate(msg) {
		const m = msg.messages[0]
		// console.log(m)
		if (!msg || !m.message) return
		if (Baileys.isJidBroadcast(m.key.remoteJid) || m.key.id.startsWith('BAE5') && m.key.id.length === 16 || m.key.id.startsWith('3EB0') && m.key.id.length === 12) return
		const from = m.chat = m.key.remoteJid
		const type = Object.keys(m.message)[0]
		const mentionedJid = m.mentionedJid = m.message[type].contextInfo ? m.message[type].contextInfo.mentionedJid : []
		const quoted = m.quoted = m.message[type].contextInfo ? m.message[type].contextInfo.quotedMessage : null
		const typeQuoted = quoted && Object.keys(quoted)[0]
		// const body = m.message.conversation || m.message[type].caption || m.message[type].text || (type == 'listResponseMessage' && m.message[type].singleSelectReply.selectedRowId) || (type == 'buttonsResponseMessage' && m.message[type].selectedButtonId) || (type == 'templateButtonReplyMessage' && m.message[type].selectedId) || ''
		const body = m.message.conversation || (m.message.imageMessage && m.message.imageMessage.caption) || (m.message.videoMessage && m.message.videoMessage.caption) || (m.message.extendedTextMessage && m.message.extendedTextMessage.text) || (m.message.listResponseMessage && m.message.listResponseMessage.singleSelectReply.selectedRowId) || (m.message.buttonsResponseMessage && m.message.buttonsResponseMessage.selectedButtonId) || (m.message.templateButtonReplyMessage && m.message.templateButtonReplyMessage.selectedId) || ''
		const command = body.startsWith(prefix) ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : ''
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join` `
			
		const isGroup = Baileys.isJidGroup(from)
		const sender = m.key.fromMe ? conn.user.jid : isGroup ? m.key.participant : from
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : {}
		const groupAdmins = isGroup ? await conn.getGroupAdmins(from) : []
		const groupName = isGroup ? groupMetadata.subject : ''
		const isAdmin = isGroup && groupAdmins.includes(sender)
		const isBotAdmin = isGroup && groupAdmins.includes(conn.user.jid)
		const pushname = m.key.fromMe ? (conn.user.name || conn.user.verifiedName) : m.pushName
		const isOwner = m.key.fromMe || ownerNumber.map(v => v.replace(/\D/g, '') + '@s.whatsapp.net').includes(sender)
			
		const isQuotedImage = quoted ? (/document|image/.test(typeQuoted) && /image/.test(quoted[typeQuoted].mimetype)) : false
		const isQuotedVideo = quoted ? (/document|video/.test(typeQuoted) && /video/.test(quoted[typeQuoted].mimetype)) : false
		const isQuotedSticker = quoted ? /sticker/.test(typeQuoted) : false
			
		const reply = (text, opt) => conn.reply(from, text, m, opt)
			
		if (mode == 'self' && !isOwner) return
		if (m.message) console.log(`[${color(time, 'green')}] ${color(body || util.format(m.message), 'cyan')} dari ${color(pushname, 'blue')} di ${color(isGroup ? groupName : 'Private chat', 'purple')} (${from})`)
		/*
		if (isGroup && m.message.viewOnceMessage && !m.key.fromMe) {
			let tipe = m.message.viewOnceMessage.message.videoMessage ? m.message.viewOnceMessage.message.videoMessage : m.message.viewOnceMessage.message.imageMessage
			tipe.viewOnce = false
			let mek = m.message.viewOnceMessage.message.imageMessage ? { key: { fromMe: false, participant: sender, id: m.key.id }, message: { viewOnceMessage: { message: { imageMessage: { viewOnce: true }}}}} :  { key: { fromMe: false, participant: sender, id: m.key.id }, message: { viewOnceMessage: { message: { videoMessage: { viewOnce: true }}}}}
			let once = Baileys.generateWAMessageFromContent(from, m.message.viewOnceMessage.message, { quoted: mek })
			await reply('viewOnce detected!').then(() => conn.relayMessage(from, once.message, { messageId: pe.key.id }))
		}
		
		conn.sendReadReceipt(from, sender, [m.key.id])
		*/
		switch (true) {
			/** Menu **/
			case /^(menu|help)$/i.test(command): {
				let { data } = await conn.getFile(pickRandom(thumbnailUrl))
				if (isGroup) {
					let buttons = [{ buttonId: prefix + 'ping', buttonText: { displayText: 'Ping', type: 1 }}, { buttonId: prefix + 'owner', buttonText: { displayText: 'Owner', type: 1 }}, { buttonId: prefix + 'tos', buttonText: { displayText: 'TOS', type: 1 }}]
					await conn.sendMessage(from, { location: { jpegThumbnail: data }, caption: menu(clockString), footer: `Hai @${sender.split('@')[0]} ${decodeURI('%F0%9F%91%8B')}`, mentions: [sender], buttons })
				} else {
					let templateButtons = [{ urlButton: { displayText: 'Source Code', url : pkg.homepage }}, { quickReplyButton: { displayText: 'Ping', id: prefix + 'ping' }}, { quickReplyButton: { displayText: 'Owner', id: prefix + 'owner' }}, { quickReplyButton: { displayText: 'TOS', id: prefix + 'tos' }}]
					await conn.sendMessage(from, { location: { jpegThumbnail: data }, caption: menu(clockString), footer: `Hai ${pushname} ${decodeURI('%F0%9F%91%8B')}`, templateButtons })
				}
				break
			}
			case /^(tos|rules|rule)$/i.test(command): {
				reply(tos(prefix))
				break
			}
				
			/** Owner **/
			case /^>?> /.test(body): {
				if (!isOwner) return
				let teks
				try {
					teks = await eval(`(async () => { ${(/^>>/.test(body) ? 'return ' : '') + q} })()`)
				} catch (e) {
					teks = e
				} finally {
					reply(teks)
				}
				break
			}
			case /^[$] /.test(body): {
				if (!isOwner) return
				await reply('Executing...')
				cp.exec(q, (stderr, stdout) => {
					if (stderr) reply(stderr)
					if (stdout) reply(stdout)
				})
				break
			}
			case /^setprefix$/i.test(command): {
				if (!isOwner) return
				global.prefix = q
				reply(`Success change prefix to ${q}`)
				break
			}
			case /^(self|publi(k|c))$/i.test(command): {
				if (!isOwner) return
				global.mode = /self/i.test(body) ? 'self' : 'public'
				reply(`Success change mode to ${mode}`)
				break
			}
			case /^set(ppbot|botpp)$/i.test(command): {
				if (!isOwner) return reply(mess.owner)
				if (/image/.test(type) || isQuotedImage) {
					let media = await conn.downloadM(quoted ? quoted[typeQuoted] : m.message[type], quoted ? typeQuoted.replace(/Message/, '') : type.replace(/Message/, ''))
					await conn.updateProfilePicture(conn.user.jid, media).then(() => reply('Success update profile picture bot')).catch(reply)
				} else if (args[0] && isUrl(args[0])) {
					await reply(mess.wait)
					await conn.updateProfilePicture(conn.user.jid, { url: args[0] }).then(() => reply('Success update profile picture bot')).catch(reply)
				} else reply(`Example:\n${prefix + command} reply image\nOr\n${prefix + command} ${pickRandom(thumbnailUrl)}`)
				break
			}
			case /^join$/i.test(command): {
				if (!isOwner) return reply(mess.owner)
				let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
				let [_, code] = q.match(linkRegex) || []
				if (!code) return reply('Invalid url')
				await conn.groupAcceptInvite(code).then(async (gid) => {
					let groupMeta = await conn.groupMetadata(gid)
					reply(`Success join group ${groupMeta.subject}`)
				}).catch(reply)
				break
			}
				
			/** Group **/
			case /^leave$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				await reply(`${decodeURI('%F0%9F%91%8B')}Sayonara...`).then(() => conn.groupLeave(from))
				break
			}
			case /^hidetag$/i.test(command): {
				if (isGroup && (isAdmin || isOwner)) {
					conn.reply(from, q, null, { mentions: groupMetadata.participants.map(v => v.id) })
				} else reply(isGroup ? mess.admin : mess.group)
				break
			}
			case /^tagall$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				let member = groupMetadata.participants.map(v => v.id)
				let teks = q + '\n\n', num = 1
				for (let x of member) teks += `${num++}. @${x.split('@')[0]}\n`
				reply(teks.trim(), { mentions: member })
				break
			}
			case /^revoke$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				if (!isAdmin) return reply(mess.admin)
				if (!isBotAdmin) return reply(mess.botAdmin)
				await conn.groupRevokeInvite(from).then(() => reply('Success reset link group'))
				break
			}
			case /^gro?up$/i.test(command): {
				
				break
			}
			case /^link(gro?up|gc)?$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				if (!isBotAdmin) return reply(mess.botAdmin)
				await conn.groupInviteCode(from).then(res => {
					let buttons = [{ buttonId: m.key.id, buttonText: { displayText: 'Ok', type: 1 }}, { buttonId: prefix + 'revoke', buttonText: { displayText: 'Revoke', type: 1 }}]
					conn.sendMessage(from, { text: `https://chat.whatsapp.com/${res}`, footer: `Link Group: ${groupName}`, buttons }, { quoted: m })
				}).catch(reply)
				break
			}
			case /^setpp(gro?up|gc)$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				if (!isAdmin) return reply(mess.admin)
				if (!isBotAdmin) return reply(mess.botAdmin)
				if (/image/.test(type) || isQuotedImage) {
					await reply(mess.wait)
					let media = await conn.downloadM(quoted ? quoted[typeQuoted] : m.message[type], quoted ? typeQuoted.replace(/Message/, '') : type.replace(/Message/, ''))
					await conn.updateProfilePicture(from, media).then(() => reply('Success update profile picture group')).catch(reply)
				} else if (args[0] && isUrl(args[0])) {
					await reply(mess.wait)
					await conn.updateProfilePicture(from, { url: args[0] }).then(() => reply('Success update profile picture group')).catch(reply)
				} else reply(`Example:\n${prefix + command} reply image\nOr\n${prefix + command} ${pickRandom(thumbnailUrl)}`)
				break
			}
			case /^(promote|demote)$/i.test(command): {
				if (!isGroup) return reply(mess.group)
				if (!isAdmin) return reply(mess.admin)
				if (!isBotAdmin) return reply(mess.botAdmin)
				let action = /pro/i.test(body) ? 'promote' : 'demote'
				let users = quoted ? [m.message[type].contextInfo.participant] : mentionedJid
				if (!users[0]) return reply(`Example:\n${prefix + command} @tag\nOr\n${prefix + command} reply member`)
				if (mentionedJid.length > 1) return reply('Just tag one member')
				await conn.groupParticipantsUpdate(from, users, action).then(() => reply(`Success ${action} member`)).catch(reply)
				break
			}
				
			/** Converter **/
			case /^s(tic?ker)?(gif)?$/i.test(command): {
				if (/image|video/.test(type)) {
					let media = await conn.downloadM(m.message[type], type.replace(/Message/, ''))
					await conn.sendSticker(from, media, m, { pack: packName, author: authorName, keepScale: true })
				} else if ((isQuotedSticker && /false/.test(quoted[typeQuoted].isAnimated)) || isQuotedImage || isQuotedVideo) {
					let media = await conn.downloadM(quoted[typeQuoted], typeQuoted.replace(/Message/, ''))
					await conn.sendSticker(from, media, m, { pack: packName, author: authorName, keepScale: true })
				} else if (/buttons/.test(typeQuoted)) {
					let tipe = quoted[typeQuoted].imageMessage ? quoted[typeQuoted].imageMessage : quoted[typeQuoted].videoMessage
					let media = await conn.downloadM(tipe, quoted[typeQuoted].imageMessage ? 'image' : 'video')
					await conn.sendSticker(from, media, m, { pack: packName, author: authorName, keepScale: true })
				} else if (/viewOnce/.test(typeQuoted)) {
					let tipe = quoted[typeQuoted].message.imageMessage ? quoted[typeQuoted].message.imageMessage : quoted[typeQuoted].message.videoMessage
					let media = await conn.downloadM(tipe, quoted[typeQuoted].message.imageMessage ? 'image' : 'video')
					await conn.sendSticker(from, media, m, { pack: packName, author: authorName, keepScale: true })
				} else if (args[0] && isUrl(args[0])) {
					await conn.sendSticker(from, args[0], m, { pack: packName, author: authorName, keepScale: true })
				} else reply('Conversion failed...')
				break
			}
			case /^(stic?kertele(gram)?|telestic?ker)$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://t.me/addstickers/j9jvq_by_CalsiBot`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zeks', '/telegram-sticker', { url: args[0] })).then(async ({ data }) => {
					let length = data.result.length
					await reply(`Sending ${length} stickers...`)
					if (length > 20) {
						await reply(`Jumlah stiker lebih dari 20, bot akan mengirimkannya di private chat`)
						for (let x of data.result) {
							await delay(2000)
							conn.sendSticker(sender, x, 0, { pack: packName, author: authorName, keepScale: true })
						}
					} else {
						for (let x of data.result) {
							await delay(2000)
							conn.sendSticker(from, x, 0, { pack: packName, author: authorName, keepScale: true })
						}
					}
				}).catch(reply)
				break
			}
			case /^to(img|gif|vid(eo)?)$/i.test(command): {
				if (isQuotedSticker && /false/.test(quoted[typeQuoted].isAnimated)) {
					await reply(mess.wait)
					let url = await uploadFile(await conn.downloadM(quoted[typeQuoted], 'sticker'))
					conn.sendFile(from, API('hadi', '/converter/ezgif-with-url/webp-to-png', { url }), '', '', m)
				} else if (isQuotedSticker && /true/.test(quoted[typeQuoted].isAnimated)) {
					await reply(mess.wait)
					let url = await uploadFile(await conn.downloadM(quoted[typeQuoted], 'sticker'))
					conn.sendMessage(from, { video: { url: API('hadi', '/converter/ezgif-with-url/webp-to-mp4', { url }) }, gifPlayback: /gif/i.test(body) }, { quoted: m })
				} else reply(`Example:\n${prefix + command} reply sticker`)
				break
			}
			case /^tourl$/i.test(command): {
				if (/image|video/.test(type) || isQuotedImage || isQuotedVideo) {
					await reply(mess.wait)
					let media = await conn.downloadM(quoted ? quoted[typeQuoted] : m.message[type], quoted ? typeQuoted.replace(/Message/, '') : type.replace(/Message/, ''))
					functions.uploadImage(media).then(v => reply(v))
				} else if (/buttons/.test(typeQuoted)) {
					await reply(mess.wait)
					let tipe = quoted[typeQuoted].imageMessage ? quoted[typeQuoted].imageMessage : quoted[typeQuoted].videoMessage
					let media = await conn.downloadM(tipe, quoted[typeQuoted].imageMessage ? 'image' : 'video')
					functions.uploadImage(media).then(v => reply(v))
				} else if (/viewOnce/.test(typeQuoted)) {
					await reply(mess.wait)
					let tipe = quoted[typeQuoted].message.imageMessage ? quoted[typeQuoted].message.imageMessage : quoted[typeQuoted].message.videoMessage
					let media = await conn.downloadM(tipe, quoted[typeQuoted].message.imageMessage ? 'image' : 'video')
					functions.uploadImage(media).then(v => reply(v))
				} else if (/sticker|document|audio/.test(typeQuoted)) {
					await reply(mess.wait)
					let media = await conn.downloadM(quoted[typeQuoted], typeQuoted.replace(/Message/, ''))
					uploadFile(media).then(v => reply(v))
				} else reply(`Reply media dgn caption ${prefix + command}`)
				break
			}
			
			/** Downloader **/
			case /^yt(mp3|a)$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://youtu.be/9r8ygFkI-H4`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/youtube', { link: args[0] })).then(async ({ data }) => {
					let { url } = data.medias.filter(v => /128/.test(v.quality) && /true/.test(v.audioAvailable) && /false/.test(v.videoAvailable))[0]
					let buttons = [{ buttonId: `${prefix}ytv ${args[0]}`, buttonText: { displayText: 'Video', type: 1 }}]
					await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: parseResult(data, { title: 'YTMP3 DOWNLOADER', ignoreKey: ['medias'] }), buttons }, { quoted: m })
					conn.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m })
				}).catch(reply)
				break
			}
			case /^yt(mp4|v)$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://youtu.be/9r8ygFkI-H4`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/youtube', { link: args[0] })).then(async ({ data }) => {
					let { url } = data.medias.filter(v => /720|480|360/.test(v.quality) && /true/.test(v.audioAvailable) && /true/.test(v.videoAvailable))[0]
					let buttons = [{ buttonId: `${prefix}yta ${args[0]}`, buttonText: { displayText: 'Audio', type: 1 }}]
					await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: parseResult(data, { title: 'YTMP4 DOWNLOADER', ignoreKey: ['medias'] }), buttons }, { quoted: m })
					conn.sendFile(from, url, '', '', m, { jpegThumbnail: (await conn.getFile(data.thumbnail)).data })
				}).catch(reply)
				break
			}
			case /^play$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} hikaru nara`)
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/play', { query: q })).then(async ({ data }) => {
					let { url } = data.medias.filter(v => /128/.test(v.quality) && /true/.test(v.audioAvailable) && /false/.test(v.videoAvailable))[0]
					let buttons = [{ buttonId: `${prefix}ytv ${data.url}`, buttonText: { displayText: 'Video', type: 1 }}]
					await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: parseResult(data, { title: 'YT PLAY', ignoreKey: ['medias'] }), buttons }, { quoted: m })
					conn.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: m })
				}).catch(reply)
				break
			}
			case /^tiktok$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://vt.tiktok.com/ZSePuga28\nOr\n${prefix + command} https://vt.tiktok.com/ZSePuga28 -mp3`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/tiktok', { link: args[0] })).then(async ({ data }) => {
					let { metaData, videoInfo } = data
					if (/-mp3/i.test(args[1])) return conn.sendFile(from, metaData.audio, '', '', m)
					else conn.sendMessage(from, { video: { url: metaData.nowatermark }, jpegThumbnail: (await conn.getFile(metaData.thumbnail)).data, caption: videoInfo.desc, buttons: [{ buttonId: `${prefix + command} ${args[0]} -mp3`, buttonText: { displayText: 'Audio', type: 1 }}] }, { quoted: m })
				}).catch(reply)
				break
			}
			case /^ig(dl)?$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://vt.tiktok.com/ZSePuga28\nOr\n${prefix + command} https://www.instagram.com/p/CTMnneTl8YJ/?utm_medium=copy_link&apikey=AAgXXQeo`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/igdl', { link: args[0] })).then(v => v.data.map(x => conn.sendFile(from, x, '', x, m))).catch(reply)
				break
			}
			case /^tw(itter|tdl)$/i.test(command): {
				if (!q) return reply(`Example:\n${prefix + command} https://mobile.twitter.com/natumegu/status/1471453661486522371?t=rBbTNTyHR-uJMCIbXYCG5w&s=19`)
				if (!isUrl(args[0])) return reply('Invalid url')
				await reply(mess.wait)
				axios.get(API('zacros', '/downloader/twitter', { link: args[0] })).then(async ({ data }) => {
					if (/-hd/i.test(args[1])) return conn.sendMessage(from, { video: { url: data.HD }, jpegThumbnail: (await conn.getFile(data.thumb)).data, caption: data.desc }, { quoted: m })
					else conn.sendMessage(from, { video: { url: data.SD }, jpegThumbnail: (await conn.getFile(data.thumb)).data, caption: data.desc, buttons: [{ buttonId: `${prefix + command} ${args[0]} -hd`, buttonText: { displayText: 'HD', type: 1 }}] }, { quoted: m })
				}).catch(reply)
				break
			}
			case /^pinterest$/i.test(command): {
				if (q && !isUrl(q)) {
					await reply(mess.wait)
					axios.get(API('zacros', '/search/pinterest', { query: q })).then(async ({ data }) => {
						let url = pickRandom(data.result)
						conn.sendMessage(from, { image: { url }, caption: url, footer: 'Hasil Pencarian: ' + q.replace(/^./, v => v.toUpperCase()), buttons: [{ buttonId: `${prefix + command} ${q}`, buttonText: { displayText: 'Next', type: 1 }}] }, { quoted: m })
					}).catch(reply)
				} else if (args[0] && isUrl(args[0])) {
					await reply(mess.wait)
					axios.get(API('zacros', '/downloader/pindl', { link: args[0] })).then(v => conn.sendFile(from, v.data.result, '', v.data.result, m)).catch(reply)
				} else reply(`Example:\n${prefix + command} hu tao\nOr\n${prefix + command} https://id.pinterest.com/pin/25403185388744079`)
				break
			}
			case /^pixiv$/i.test(command): {
				if (args[0] && !isUrl(args[0])) {
					await reply(mess.wait)
					conn.getFile(`https://pixiv.cat/${args[0]}.${args[1] || 'jpg'}`).then(v => conn.sendFile(from, v.data, '', '', m)).catch(reply)
				} else if (args[0] && isUrl(args[0])) {
					await reply(mess.wait)
					conn.getFile(`https://pixiv.cat/${args[0].split('/')[5]}.${args[1] || 'jpg'}`).then(v => conn.sendFile(from, v.data, '', '', m)).catch(reply)
				} else reply(`For Single Image:\n${prefix + command} https://www.pixiv.net/en/artworks/72795242n\nFor Multiple Images:\n${prefix + command} https://www.pixiv.net/en/artworks/64486737-1\n(-1 is page number)`)
				break
			}
			case /^s(cdl|oundcloud)$/i.test(command): {
				if (q && !isUrl(q)) {
					axios.get(API('hadi', '/soundcloud/play', { query: q })).then(async ({ data }) => {
						await reply(mess.wait)
						await conn.sendFile(from, data.result.thumbnail, '', parseResult(data.result, { title: 'SOUNDCLOUD PLAY', ignoreKey: ['download'] }), m)
						conn.sendMessage(from, { audio: { url: data.result.download }, mimetype: 'audio/mpeg' }, { quoted: m })
					}).catch(reply)
				} else if (args[0] && isUrl(args[0])) {
					axios.get(API('zacros', '/downloader/scdl', { link: args[0] })).then(async ({ data }) => {
						await reply(mess.wait)
						await conn.sendFile(from, data.thumb, '', parseResult(data, { title: 'SOUNDCLOUD DOWNLOADER', ignoreKey: ['link'] }), m)
						conn.sendMessage(from, { audio: { url: data.link }, mimetype: 'audio/mpeg' }, { quoted: m })
					}).catch(reply)
				} else reply(`Example:\n${prefix + command} https://m.soundcloud.com/fradical/first-date\nOr\n${prefix + command} first date`)
				break
			}
				
			/** Ya begitulah **/
			case /^(get|fetch)$/i.test(command): {
				if (!args[0]) return reply('Urlnya?')
				axios.get(args[0]).then(res => {
					if (!/text|json/.test(res.headers['content-type'])) return conn.sendFile(from, args[0], '', q, m)
					else reply(res.data)
				}).catch(reply)
				break
			}
			case /^owner$/i.test(command): {
				let owner = ownerNumber[1].replace(/\D/g, '')
				let contacts = Baileys.generateWAMessageFromContent(from, Baileys.proto.Message.fromObject({ contactsArrayMessage: { displayName: 'Owner', contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Ripp\nTEL;waid=${owner}:${owner}\nEND:VCARD` }] }}), { userJid: conn.user.jid, quoted: m })
				await conn.relayMessage(from, contacts.message, { messageId: contacts.key.id })
				// conn.sendContact(from, ownerNumber[1], 'Ripp', m)
				break
			}
			case /^cekprefix$/i.test(body): {
				reply('Prefix: ' + prefix)
				break
			}
			case /^del(ete)?$/i.test(command): {
				if (quoted && m.message[type].contextInfo.participant == conn.user.jid) conn.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: m.message[type].contextInfo.stanzaId, participant: m.message[type].contextInfo.participant }})
				break
			}
			case /^(up|run)time$/i.test(command): {
				reply(clockString(process.uptime()))
				break
			}
			case /^(ping|speed)$/i.test(command): {
				let old = +new Date
				await reply('_Testing speed..._')
				let neww = +new Date
				let speed = functions.parseMs(neww - old)
				reply(`Merespon dalam ${speed.seconds}.${speed.milliseconds} detik`)
				break
			}
			case /^(list(grup|group|gc)|grouplist)$/i.test(command): {
				let grup = Object.values(await conn.groupFetchAllParticipating()).map(v => `${v.subject}\n${v.id}`).join`\n\n`
				reply('List Groups:\n\n' + grup)
				break
			}
			default:
			break
		}
		/*
		switch (command) {
			case 'tes': {
				require('./lib/jadibot.js').jadibot(conn, m)
				break
			}
			default:
			break
		}
		*/
	},
	async participantsUpdate(event) {
		console.log(event)
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`[UPDATE] '${__filename}'`)
	delete require.cache[file]
	require(file)
})

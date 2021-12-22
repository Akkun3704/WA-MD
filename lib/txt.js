exports.menu = (clockString) => {
	let tanggal = new Date().toLocaleString('id', { dateStyle: 'full' })
	let waktu = new Date().getHours()
	waktu = waktu > 2 && waktu < 4 ? 'Dini Hari' : waktu < 11 ? 'Pagi' : waktu < 16 ? 'Siang' : waktu < 19 ? 'Sore' : 'Malam'
	let time = new Date().toLocaleString('id', { timeStyle: 'long' })
	return `
*INFO*
• Lib: Baileys-MD
• Tanggal: ${tanggal}
• Waktu: ${waktu} || ${time}
• Runtime: ${clockString(process.uptime())}

*GAME*
• ${prefix}susunkata
• ${prefix}tebakkata
• ${prefix}tebakgambar

*RANDOM IMAGE*
• ${prefix}neko
• ${prefix}waifu

*CONVERTER*
• ${prefix}toimg <reply>
• ${prefix}tourl <caption / reply>
• ${prefix}stiker <caption / reply / url> [-crop]

*DOWNLOADER*
• ${prefix}igdl <url>
• ${prefix}ytmp3 <url>
• ${prefix}ytmp4 <url>
• ${prefix}play <query>
• ${prefix}pixiv <id / url>
• ${prefix}stickertele <url>
• ${prefix}twitter <url> [-hd]
• ${prefix}tiktok <url> [-mp3]
• ${prefix}nhentaipdf <code>
• ${prefix}pinterest <query / url>
• ${prefix}soundcloud <query / url>

*MAKER*
• ${prefix}kannagen <teks>
• ${prefix}trumptweet <teks>
• ${prefix}memegen <teks|teks>

*SEARCH*
• ${prefix}google <query>
• ${prefix}ytsearch <query>
• ${prefix}whatmusic <caption / reply>

*GROUP*
• ${prefix}link
• ${prefix}leave
• ${prefix}revoke
• ${prefix}tagall [teks]
• ${prefix}hidetag [teks]
• ${prefix}group [option]
• ${prefix}demote <@tag / reply>
• ${prefix}promote <@tag /reply>
• ${prefix}setppgrup <caption / reply / url>

*OWNER*
• $
• > / >>
• ${prefix}self
• ${prefix}public
• ${prefix}restart
• ${prefix}join <url>
• ${prefix}setprefix [prefix]
• ${prefix}setppbot <caption / reply / url>

*MISC*
• cekprefix
• ${prefix}ping
• ${prefix}runtime
• ${prefix}listgroup
• ${prefix}get <url>
• ${prefix}ssweb <url>
• ${prefix}delete <reply>
`.trim()
}

exports.tos = (prefix) => {
	return `
Panduan:
Format command
< > adalah wajib di isi/lakukan
[ ] adalah query tambahan, jika tidak ada bot akan menganggap pilihan default
( ) tidak masuk command, sekedar informasi

Contoh command full:
${prefix}tiktok https://vt.tiktok.com/ZSePuga28 -mp3
Contoh command biasa:
${prefix}tiktok https://vt.tiktok.com/ZSePuga28

reply: mereply sesuatu lalu ketik command
caption: upload media dengan caption command
url: link yang ingin dieksekusi
query: parameter. semisal query pinterest adalah gambar apa yang kalian ingin cari

Kendala? hubungi owner.
`.trim()
}

exports.mess = {
	wait: 'Loading...',
	group: 'Perintah ini hanya bisa digunakan di dalam Grup!',
	admin: 'Perintah ini hanya bisa digunakan oleh Admin Grup!',
	botAdmin: 'Perintah ini hanya bisa digunakan ketika Bot menjadi Admin!',
	owner: 'Perintah ini hanya bisa digunakan oleh Owner Bot!'
}

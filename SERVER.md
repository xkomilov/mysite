# Server holati — xayrullokomilov.uz

Holat sanasi: **2026-09-28**. Versiyalar avtomatik yangilanishlar bilan o‘zgarib boradi.

> Bu faylda sirlar yo‘q: parol, SSH kalit, token va serverning IP manzillari yozilmagan.
> Repo ochiq, IP manzil esa Cloudflare ortida yashirin turishi kerak.
> IP manzilni Hetzner konsolidan olasiz: **Servers → xayrullokomilov-web**.

## Provayder

| | |
|---|---|
| Provayder | Hetzner Cloud |
| Joylashuv | Helsinki, Finlyandiya |
| Server nomi | `xayrullokomilov-web` |
| Resurslar | 2 vCPU, 3,7 GB RAM, 38 GB disk |
| Tarmoq | IPv4 va IPv6 (manzillar — Hetzner konsolida) |
| Zaxira nusxa | Hetzner Backups yoqilgan |

## Operatsion tizim

| | |
|---|---|
| OS | Ubuntu 26.04.1 LTS |
| Yadro | 7.0.0-34-generic |
| Vaqt mintaqasi | UTC (Toshkent = UTC+5) |

## O‘rnatilgan dasturlar

| Dastur | Versiya | Izoh |
|---|---|---|
| Caddy | v2.11.4 | Veb-server, HTTPS sertifikatlarini o‘zi oladi va yangilaydi. Rasmiy manba: `dl.cloudsmith.io` |
| Node.js | v24.21.0 (LTS) | npm 11.19.0 bilan. Rasmiy manba: NodeSource (`deb.nodesource.com`); Ubuntu’ning eskiroq 22-versiyasidan ustun qo‘yilgan |
| Docker Engine | 29.8.1 | Rasmiy manba: `download.docker.com`. containerd 2.3.6 |
| Docker Compose | 5.5.1 | Docker plagini (`docker compose`) |
| Git | 2.53.0 | Saytni GitHub’dan tortib olish uchun |
| OpenSSH | 10.2p1 | Serverga kirish |
| ufw | 0.36.2 | Server ichidagi firewall |
| unattended-upgrades | 2.12ubuntu9 | Yangilanishlarni avtomatik o‘rnatadi: Ubuntu paketlari, hamda Docker, Node.js va Caddy manbalari |

Node.js’da bitta ilova ishlaydi: Telegram bot **myagent** (pastda — [Telegram bot (myagent)](#telegram-bot-myagent)). Docker konteynerlari hozircha yo‘q.

## Domen va DNS

Domen: **xayrullokomilov.uz**. DNS Cloudflare’da (nameserverlar: `ernest.ns.cloudflare.com`, `nena.ns.cloudflare.com`).

| Turi | Nomi | Qiymati | Cloudflare proxy |
|---|---|---|---|
| A | `@` | serverning IPv4 manzili | Proxied (to‘q sariq) |
| AAAA | `@` | serverning IPv6 manzili | Proxied (to‘q sariq) |
| CNAME | `www` | `xayrullokomilov.uz` | Proxied (to‘q sariq) |

Cloudflare sozlamalari:

- **SSL/TLS → Encryption mode:** Full (strict).
- **Always Use HTTPS:** Off. HTTP→HTTPS yo‘naltirishni Caddy qiladi; yoqilsa, sertifikat yangilanmay qolishi mumkin.
- **Caching → Browser Cache TTL:** Respect Existing Headers.
- **Proxy’ni o‘chirmang:** server 80/443 eshiklarida faqat Cloudflare’dan kelgan ulanishlarni qabul qiladi.

Eski manzil `xkomilov.github.io/mysite` GitHub Pages orqali `xayrullokomilov.uz` ga yo‘naltiriladi (repo’dagi `CNAME` fayli shuning uchun kerak).

## Ishlab turgan xizmatlar va portlar

| Xizmat | Port | Kimga ochiq |
|---|---|---|
| SSH (`sshd`) | 22/tcp | Hammaga; faqat SSH kalit bilan, parol bilan kirish o‘chirilgan |
| Caddy (sayt) | 80/tcp, 443/tcp | Faqat Cloudflare IP manzillariga |
| Caddy (boshqaruv API) | 2019/tcp | Faqat serverning o‘zi (127.0.0.1) |
| Telegram bot (`myagent`) | 3000/tcp | Faqat serverning o‘zi (127.0.0.1); tashqaridan Caddy orqali `/tg-webhook` |
| systemd-resolved (DNS) | 53 | Faqat serverning o‘zi |

Doimiy ishlaydigan va taymer xizmatlar:

| Nomi | Vazifasi |
|---|---|
| `caddy` | Saytni HTTPS bilan beradi |
| `site-update.timer` | Har daqiqada GitHub’ni tekshiradi, yangi commit bo‘lsa saytni yangilaydi |
| `myagent` | Telegram bot; yiqilsa 3 soniyada, server qayta yuklanganda esa o‘zi ishga tushadi |
| `myagent-update.timer` | Har daqiqada bot repo’sini tekshiradi, yangi commit bo‘lsa botni yangilab, qayta ishga tushiradi |
| `docker`, `containerd` | Docker konteynerlarini ishga tushiradi (hozircha konteyner yo‘q, eshik ochmagan) |
| `unattended-upgrades` | Yangilanishlarni har kuni o‘rnatadi (Ubuntu + Docker, Node.js, Caddy manbalari); kerak bo‘lsa 23:00 UTC da (04:00 Toshkent) serverni qayta yuklaydi. Docker yangilanganda konteynerlar bir necha soniyaga qayta ishga tushadi |
| `ufw` | Server ichidagi firewall |
| `chrony` | Server soatini aniq ushlab turadi |

## Firewall

- **Hetzner Cloud Firewall** (`web-firewall`): kiruvchi TCP 22, 80, 443.
- **ufw** (server ichida): standart holda hamma kiruvchi ulanish taqiqlangan; 22-port hammaga, 80/443 faqat Cloudflare’ning rasmiy IP diapazonlariga (22 ta qoida, `# Cloudflare` izohi bilan). Cloudflare yangi diapazon qo‘shsa, ro‘yxatni `cloudflare.com/ips-v4` va `cloudflare.com/ips-v6` dan yangilash kerak.

## Docker qoidalari

- `/etc/docker/daemon.json` da `"ip": "127.0.0.1"`: `-p 8080:80` kabi ochilgan eshiklar standart holda **faqat serverning ichida** ochiladi. Docker ufw’ni chetlab o‘tishi mumkin, shu sozlama bunga yo‘l qo‘ymaydi. Ilovani internetga chiqarish — Caddy orqali (`reverse_proxy 127.0.0.1:8080`) va Cloudflare’dagi subdomen bilan.
- Eshikni `-p 0.0.0.0:...` bilan to‘g‘ridan-to‘g‘ri ochmang.
- `"log-driver": "local"`: konteyner loglari hajmi cheklangan, disk to‘lib qolmaydi.
- Sirlar (bot tokenlari, baza parollari) — serverdagi `.env` fayllarida, git’ga tushmaydi.

## Sayt qanday yangilanadi

1. Kompyuterda o‘zgartirish → `git commit` → `git push`.
2. Serverdagi `site-update.timer` bir daqiqa ichida GitHub’dagi `main` tarmog‘ini tortib oladi.
3. Buni huquqi cheklangan `sitedeploy` tizim foydalanuvchisi bajaradi (parolsiz, SSH orqali kira olmaydi). Repo ochiq, shuning uchun hech qanday sir kerak emas.

HTML, CSS va JS `Cache-Control: no-cache` bilan beriladi, shuning uchun o‘zgarish darhol ko‘rinadi. Rasmlar keshlanadi: rasmni almashtirganda faylga yangi nom bering.

Saytda ochilmaydigan fayllar (404): `.git`, `.gitignore`, `CNAME` va barcha `*.md` fayllar (shu jumladan bu fayl).

## Telegram bot (myagent)

Kod: GitHub’dagi **yopiq** `xkomilov/myagent` repo. Bot Gemini orqali javob beradi, bilim bazasi — repo’dagi `bilim/` papkasi.

- Telegram xabarlarni `https://xayrullokomilov.uz/tg-webhook` ga yuboradi → Caddy → `127.0.0.1:3000` → bot.
- Bot `myagent` tizim foydalanuvchisi nomidan ishlaydi (parolsiz, SSH orqali kira olmaydi). `systemd` yoqilgan (`enabled`): server qayta yuklanganda o‘zi ishga tushadi, yiqilsa 3 soniyada qayta turadi. Kompyuter o‘chiq bo‘lsa ham ishlayveradi.
- **Sirlar** (Telegram token, webhook siri, Gemini kaliti) faqat serverdagi `/opt/myagent/.env` da: egasi `root`, faqat `myagent` guruhi o‘qiy oladi (`640`). Fayl `.gitignore` da, git unga tegmaydi va repo’ga tushmaydi. Namuna: repo’dagi `.env.example`.

### Bot qanday yangilanadi (avtodeploy)

1. Kompyuterda o‘zgartirish → `git commit` → `git push`.
2. `myagent-update.timer` bir daqiqa ichida `main` tarmog‘ini tortib oladi va botni qayta ishga tushiradi.
3. Bot 5 soniyadan keyin ishlamayotgan bo‘lsa, skript oldingi commit’ga qaytaradi va xatoni logga yozadi.
4. Repo yopiq, shuning uchun git `myagentdeploy` tizim foydalanuvchisi nomidan GitHub **deploy key** bilan ishlaydi. Kalit faqat shu repo’ni **o‘qiy oladi** (GitHub: repo → Settings → Deploy keys).
5. `xarakter.md` va `bilim/` har savolda qayta o‘qiladi, lekin baribir push qilinishi kerak — serverdagi fayllarni qo‘lda o‘zgartirmang, keyingi yangilanishda ular o‘chib ketadi.

Yangilash skripti va systemd fayllarining asl nusxasi repo’dagi `deploy/` papkasida. Ularni o‘zgartirsangiz, serverga qo‘lda qayta o‘rnatish kerak (`install` + `systemctl daemon-reload`) — avtodeploy faqat bot kodini yangilaydi.

## Muhim fayllar serverda

| Fayl yoki papka | Nima |
|---|---|
| `/var/www/xayrullokomilov.uz/` | Sayt fayllari (GitHub repo nusxasi) |
| `/etc/caddy/Caddyfile` | Caddy sozlamasi; oldingi holatlar `Caddyfile.bak-*` |
| `/usr/local/bin/site-update` | Saytni yangilash skripti |
| `/etc/systemd/system/site-update.service`, `.timer` | Yangilash xizmati va taymeri |
| `/opt/myagent/` | Telegram bot (GitHub repo nusxasi) |
| `/opt/myagent/.env` | Bot sirlari va sozlamalari (`AI_MODEL`, `AI_FALLBACK_MODEL` ham shu yerda) |
| `/usr/local/bin/myagent-update` | Botni yangilash skripti |
| `/etc/systemd/system/myagent.service` | Bot xizmati |
| `/etc/systemd/system/myagent-update.service`, `.timer` | Bot yangilash xizmati va taymeri |
| `/var/lib/myagent-deploy/.ssh/` | GitHub deploy key (faqat o‘qish) |
| `/opt/myagent.old-*` | Avtodeploy’dan oldingi qo‘lda o‘rnatilgan nusxa; bot bir-ikki kun barqaror ishlasa, o‘chirsa bo‘ladi |
| `/etc/ssh/sshd_config.d/10-hardening.conf` | SSH xavfsizlik sozlamalari |
| `/etc/apt/apt.conf.d/52-auto-reboot` | Avtomatik qayta yuklash vaqti |
| `/etc/apt/apt.conf.d/51-third-party-origins` | Docker, Node.js va Caddy manbalarini avtomatik yangilash |
| `/etc/docker/daemon.json` | Docker sozlamasi (eshiklar faqat 127.0.0.1 da, log hajmi cheklangan) |

## Loglarni qayerdan ko‘rish

Avval serverga kiring: `ssh root@<server-IP>`.

| Nimani ko‘rish | Buyruq |
|---|---|
| Caddy (sayt, sertifikatlar) — jonli | `journalctl -u caddy -f` |
| Caddy — oxirgi 100 qator | `journalctl -u caddy -n 100 --no-pager` |
| Sayt yangilanishlari | `journalctl -u site-update --since today` |
| Telegram bot — jonli | `journalctl -u myagent -f` |
| Bot yangilanishlari (avtodeploy) | `journalctl -u myagent-update --since today` |
| SSH kirishlar va urinishlar | `journalctl -u ssh --since today` |
| Avtomatik yangilanishlar | `less /var/log/unattended-upgrades/unattended-upgrades.log` |
| Firewall bloklagan ulanishlar | `journalctl -k --since today \| grep UFW` |
| Docker xizmatining o‘zi | `journalctl -u docker --since today` |
| Ishlayotgan konteynerlar | `docker ps` |
| Konteyner loglari — jonli | `docker logs -f <konteyner-nomi>` |
| Ishlamay qolgan xizmatlar | `systemctl --failed` |
| Taymerlar qachon ishlaydi | `systemctl list-timers` |

## Tez-tez kerak bo‘ladigan buyruqlar

| Vazifa | Buyruq |
|---|---|
| Caddy sozlamasini tekshirish | `caddy validate --config /etc/caddy/Caddyfile` |
| Caddy’ni qayta yuklash (to‘xtatmasdan) | `systemctl reload caddy` |
| Saytni hoziroq yangilash | `systemctl start site-update.service` |
| Botni hoziroq yangilash | `systemctl start myagent-update.service` |
| Botni qayta ishga tushirish (masalan `.env` o‘zgargach) | `systemctl restart myagent` |
| Bot holati | `systemctl status myagent` |
| Firewall holati | `ufw status verbose` |
| Qayta yuklash kerakmi | `ls /var/run/reboot-required` (fayl bo‘lsa — kerak) |
| Serverni qayta yuklash | `reboot` |

Agar SSH orqali kira olmasangiz: Hetzner konsolida serverni tanlab, **Console** tugmasi orqali brauzerdan kiring.

# Server holati — xayrullokomilov.uz

Holat sanasi: **2026-09-27**. Versiyalar avtomatik yangilanishlar bilan o‘zgarib boradi.

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
| Caddy | v2.11.4 | Veb-server, HTTPS sertifikatlarini o‘zi oladi va yangilaydi. Rasmiy apt manbasidan |
| Git | 2.53.0 | Saytni GitHub’dan tortib olish uchun |
| OpenSSH | 10.2p1 | Serverga kirish |
| ufw | 0.36.2 | Server ichidagi firewall |
| unattended-upgrades | 2.12ubuntu9 | Xavfsizlik yangilanishlarini avtomatik o‘rnatadi |
| Node.js | — | O‘rnatilmagan |
| Docker | — | O‘rnatilmagan |

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
| systemd-resolved (DNS) | 53 | Faqat serverning o‘zi |

Doimiy ishlaydigan va taymer xizmatlar:

| Nomi | Vazifasi |
|---|---|
| `caddy` | Saytni HTTPS bilan beradi |
| `site-update.timer` | Har daqiqada GitHub’ni tekshiradi, yangi commit bo‘lsa saytni yangilaydi |
| `unattended-upgrades` | Xavfsizlik yangilanishlarini har kuni o‘rnatadi; kerak bo‘lsa 23:00 UTC da (04:00 Toshkent) serverni qayta yuklaydi |
| `ufw` | Server ichidagi firewall |
| `chrony` | Server soatini aniq ushlab turadi |

## Firewall

- **Hetzner Cloud Firewall** (`web-firewall`): kiruvchi TCP 22, 80, 443.
- **ufw** (server ichida): standart holda hamma kiruvchi ulanish taqiqlangan; 22-port hammaga, 80/443 faqat Cloudflare’ning rasmiy IP diapazonlariga (22 ta qoida, `# Cloudflare` izohi bilan). Cloudflare yangi diapazon qo‘shsa, ro‘yxatni `cloudflare.com/ips-v4` va `cloudflare.com/ips-v6` dan yangilash kerak.

## Sayt qanday yangilanadi

1. Kompyuterda o‘zgartirish → `git commit` → `git push`.
2. Serverdagi `site-update.timer` bir daqiqa ichida GitHub’dagi `main` tarmog‘ini tortib oladi.
3. Buni huquqi cheklangan `sitedeploy` tizim foydalanuvchisi bajaradi (parolsiz, SSH orqali kira olmaydi). Repo ochiq, shuning uchun hech qanday sir kerak emas.

HTML, CSS va JS `Cache-Control: no-cache` bilan beriladi, shuning uchun o‘zgarish darhol ko‘rinadi. Rasmlar keshlanadi: rasmni almashtirganda faylga yangi nom bering.

Saytda ochilmaydigan fayllar (404): `.git`, `.gitignore`, `CNAME` va barcha `*.md` fayllar (shu jumladan bu fayl).

## Muhim fayllar serverda

| Fayl yoki papka | Nima |
|---|---|
| `/var/www/xayrullokomilov.uz/` | Sayt fayllari (GitHub repo nusxasi) |
| `/etc/caddy/Caddyfile` | Caddy sozlamasi; oldingi holatlar `Caddyfile.bak-*` |
| `/usr/local/bin/site-update` | Saytni yangilash skripti |
| `/etc/systemd/system/site-update.service`, `.timer` | Yangilash xizmati va taymeri |
| `/etc/ssh/sshd_config.d/10-hardening.conf` | SSH xavfsizlik sozlamalari |
| `/etc/apt/apt.conf.d/52-auto-reboot` | Avtomatik qayta yuklash vaqti |

## Loglarni qayerdan ko‘rish

Avval serverga kiring: `ssh root@<server-IP>`.

| Nimani ko‘rish | Buyruq |
|---|---|
| Caddy (sayt, sertifikatlar) — jonli | `journalctl -u caddy -f` |
| Caddy — oxirgi 100 qator | `journalctl -u caddy -n 100 --no-pager` |
| Sayt yangilanishlari | `journalctl -u site-update --since today` |
| SSH kirishlar va urinishlar | `journalctl -u ssh --since today` |
| Avtomatik yangilanishlar | `less /var/log/unattended-upgrades/unattended-upgrades.log` |
| Firewall bloklagan ulanishlar | `journalctl -k --since today \| grep UFW` |
| Ishlamay qolgan xizmatlar | `systemctl --failed` |
| Taymerlar qachon ishlaydi | `systemctl list-timers` |

## Tez-tez kerak bo‘ladigan buyruqlar

| Vazifa | Buyruq |
|---|---|
| Caddy sozlamasini tekshirish | `caddy validate --config /etc/caddy/Caddyfile` |
| Caddy’ni qayta yuklash (to‘xtatmasdan) | `systemctl reload caddy` |
| Saytni hoziroq yangilash | `systemctl start site-update.service` |
| Firewall holati | `ufw status verbose` |
| Qayta yuklash kerakmi | `ls /var/run/reboot-required` (fayl bo‘lsa — kerak) |
| Serverni qayta yuklash | `reboot` |

Agar SSH orqali kira olmasangiz: Hetzner konsolida serverni tanlab, **Console** tugmasi orqali brauzerdan kiring.

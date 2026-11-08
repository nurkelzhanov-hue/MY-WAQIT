# MY WAQIT

AI waqıt hám reje basqarıwshısı. Telegram Mini App túrinde isleydi, keyin Android hám iPhone qosımshasına aylandırıladı.

## Házirgi jaǵday

**1-basqısh (joba skeleti) tamamlandı:** frontend, backend, bot hám maǵlıwmatlar bazası dúzilisi jaratıldı.

Keyingi basqısh: 2-basqısh, UI dizayn.

## Joba dúzilisi

| Papka / fayl | Ne ushın kerek |
|---|---|
| `frontend/` | Telegram ishinde ashılatuǵın web qosımsha (React + TypeScript + Vite). Telegram SDK: `@tma.js/sdk`. |
| `backend/` | Server (Python + FastAPI). Maǵlıwmatlar menen jumıs, AI, eskertiwler. |
| `backend/app/main.py` | FastAPI kirisiw noqatı. Házir `/api/health` endpointi bar. |
| `backend/app/api/` | API endpointleri. |
| `backend/app/core/` | Sazlamalar, qáwipsizlik (Telegram `initData` tekseriw). |
| `backend/app/models/`, `schemas/` | Maǵlıwmatlar modelleri hám validaciya. |
| `backend/app/services/` | Biznes logikası (reje, eskertiw, namaz waqıtları). |
| `backend/app/ai/` | AI integraciyası. |
| `backend/app/scheduler/` | Waqıt boyınsha avtomat jumıslar (eskertiwler, kúnlik 08:00 xabarı). |
| `bot/` | Telegram bot (aiogram). `/start` hám Mini App ashıw túymesi. |
| `supabase/migrations/` | Maǵlıwmatlar bazasınıń SQL migraciyaları. |
| `supabase/seed.sql` | Baslanǵısh maǵlıwmatlar (házir bos). |
| `docs/` | Hújjetler. |
| `.gitignore` | Maxfiy fayllar (`.env`) Git-ke túspewi ushın. |
| `*/.env.example` | Sazlamalar úlgisi. Haqıyqıy mánisler `.env` faylına jazıladı. |

## Isletiw (Windows PowerShell)

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Adres: http://localhost:5173/

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install fastapi "uvicorn[standard]" pydantic-settings python-dotenv
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Tekseriw: http://127.0.0.1:8000/api/health

### Bot

```powershell
cd bot
python -m venv venv
.\venv\Scripts\python.exe -m pip install aiogram python-dotenv
copy .env.example .env
```

`.env` faylında `BOT_TOKEN` mánisin kiritiń, soń:

```powershell
.\venv\Scripts\python.exe main.py
```

## Qáwipsizlik qaǵıydaları

- API keyler hám tokenler tek `.env` faylında saqlanadı, frontend kodında bolmaydı.
- `.env` fayllar Git-ke túspeydi.
- Maǵlıwmatlar bazasında barlıq tablitsalarda RLS qosılǵan, `anon` hám `authenticated` rollerge ruxsat berilmegen. Maǵlıwmatlarǵa tek backend kiredi.
- Backend Telegram `initData` maǵlıwmatın serverde tekseredi, frontendten kelgen `telegram_id`-ge isenbeydi.

## Tillar

Qaraqalpaq, Ózbek hám Rus. Bir paydalanıwshıǵa bir waqıtta bir tilde xabar beriledi.

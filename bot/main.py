import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from dotenv import load_dotenv

from handlers.start import router as start_router


async def main():
    load_dotenv()
    token = os.getenv("BOT_TOKEN")
    if not token:
        raise SystemExit("BOT_TOKEN tab\u0131lmad\u0131. .env fayl\u0131n tekseri\u0144.")

    logging.basicConfig(level=logging.INFO)
    bot = Bot(token=token)
    dp = Dispatcher()
    dp.include_router(start_router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())

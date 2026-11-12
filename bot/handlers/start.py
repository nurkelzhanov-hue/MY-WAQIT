import os

from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

from keyboards.main_menu import open_app_keyboard

router = Router()

# The first message is sent before the user has chosen a language,
# so it is shown in Karakalpak and Russian.
WELCOME_TEXT = (
    "MY WAQIT — AI waqıt hám reje basqarıwshıńız.\n\n"
    "Rejelerińizdi, eskertiwlerińizdi hám namaz waqıtların bir orında basqarıń.\n\n"
    "──────────\n\n"
    "MY WAQIT — ваш AI-помощник по времени и планам.\n\n"
    "Управляйте планами, напоминаниями и временем намаза в одном месте."
)


@router.message(CommandStart())
async def cmd_start(message: Message):
    url = os.getenv("WEBAPP_URL", "")
    if url.startswith("https://"):
        await message.answer(WELCOME_TEXT, reply_markup=open_app_keyboard(url))
    else:
        await message.answer(WELCOME_TEXT)

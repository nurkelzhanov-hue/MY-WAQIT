import os

from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

from keyboards.main_menu import open_app_keyboard

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    text = (
        "MY WAQIT \u2014 AI waq\u0131t h\u00e1m reje basqar\u0131wsh\u0131\u0144\u0131z.\n\n"
        "Rejeleri\u0144izdi, eskertiwleri\u0144izdi h\u00e1m namaz waq\u0131tlar\u0131n bir or\u0131nda basqar\u0131\u0144."
    )
    url = os.getenv("WEBAPP_URL", "")
    if url.startswith("https://"):
        await message.answer(text, reply_markup=open_app_keyboard(url))
    else:
        await message.answer(text)

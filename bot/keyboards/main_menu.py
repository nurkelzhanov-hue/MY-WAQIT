from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo


def open_app_keyboard(url: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="MY WAQIT-ti ash\u0131w", web_app=WebAppInfo(url=url))]
        ]
    )

"""Print a correctly signed fake initData for local testing (user id 1).

Reads BOT_TOKEN from backend/.env and prints only the derived, signed string,
never the token itself. Do not share the output outside your own machine.
"""
import hashlib
import hmac
import json
import os
import sys
import time
from pathlib import Path
from urllib.parse import urlencode

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from dotenv import load_dotenv  # noqa: E402

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
token = os.getenv("BOT_TOKEN", "").strip()
if not token:
    sys.exit("BOT_TOKEN is empty in backend/.env")

fields = {
    "auth_date": str(int(time.time())),
    "user": json.dumps({"id": 1, "first_name": "Dev", "username": "dev_user"}),
}
dcs = "\n".join(f"{k}={fields[k]}" for k in sorted(fields))
secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
fields["hash"] = hmac.new(secret, dcs.encode(), hashlib.sha256).hexdigest()
print(urlencode(fields))

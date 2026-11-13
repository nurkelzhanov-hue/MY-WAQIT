import hashlib
import hmac
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlencode

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.telegram_auth import InitDataError, verify_init_data  # noqa: E402

TOKEN = "123456:TEST-TOKEN-NOT-REAL"


def make_init_data(token=TOKEN, auth_date=None, user=None, tamper=False):
    fields = {
        "auth_date": str(int(time.time()) if auth_date is None else auth_date),
        "query_id": "AAH-test",
        "user": json.dumps(user or {"id": 42, "first_name": "Test", "username": "tester"}),
    }
    dcs = "\n".join(f"{k}={fields[k]}" for k in sorted(fields))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, dcs.encode(), hashlib.sha256).hexdigest()
    if tamper:
        fields["user"] = json.dumps({"id": 999, "first_name": "Evil"})
    return urlencode(fields)


def expect_error(fn):
    try:
        fn()
    except InitDataError:
        return
    raise AssertionError("InitDataError was expected")


def test_all():
    u = verify_init_data(make_init_data(), TOKEN)
    assert u.id == 42 and u.username == "tester"
    expect_error(lambda: verify_init_data(make_init_data(tamper=True), TOKEN))
    expect_error(lambda: verify_init_data(make_init_data(), "999:OTHER-TOKEN"))
    expect_error(lambda: verify_init_data(make_init_data(auth_date=int(time.time()) - 3 * 86400), TOKEN))
    expect_error(lambda: verify_init_data(make_init_data(auth_date=int(time.time()) + 3600), TOKEN))
    expect_error(lambda: verify_init_data("", TOKEN))
    expect_error(lambda: verify_init_data("user=%7B%7D&auth_date=1", TOKEN))
    print("all telegram_auth checks passed")


if __name__ == "__main__":
    test_all()

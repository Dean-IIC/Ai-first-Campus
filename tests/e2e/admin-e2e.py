"""End-to-end test of the admin system, run against a local build and the Supabase stand-in.

Environment: BASE (site address), MOCK (stand-in address), ADMIN_EMAIL, ADMIN_PASSWORD,
PHOTO (a JPG file to upload), CHROME (path to a Chromium build).
"""
import os, re, sys, requests
from playwright.sync_api import sync_playwright, expect

BASE = os.environ["BASE"]
MOCK = os.environ["MOCK"]
EMAIL = os.environ["ADMIN_EMAIL"]
PASSWORD = os.environ["ADMIN_PASSWORD"]
PHOTO = os.environ["PHOTO"]
CHROME = os.environ["CHROME"]
results = []

def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail and not ok else ""))

def sign_in(page, password):
    page.goto(f"{BASE}/admin/login", wait_until="load")
    page.wait_for_selector("#admin-password")
    page.wait_for_timeout(1200)  # let the form finish loading before it is submitted
    page.fill("#admin-email", EMAIL)
    page.fill("#admin-password", password)
    page.get_by_role("button", name="Sign in").click()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        visitor = browser.new_context(viewport={"width": 1280, "height": 900})
        vp = visitor.new_page()
        vp.goto(BASE + "/", wait_until="load")
        vp.wait_for_selector("h1")
        check("visitor: no admin toolbar", vp.locator("[aria-label='Admin toolbar']").count() == 0)
        if vp.locator("[data-cms]").count():
            print("   marker sample:", vp.locator("[data-cms]").first.evaluate("e => e.outerHTML"))
        check("visitor: no editable markers", vp.locator("[data-cms]").count() == 0)
        check("visitor: footer has discreet Admin link", vp.locator("a[href='/admin/login']").count() == 1)

        # 1. Sign-in: generic error, then lockout after 5 wrong attempts.
        admin = browser.new_context(viewport={"width": 1280, "height": 900}, accept_downloads=True)
        ap = admin.new_page()
        console = []
        ap.on("console", lambda m: console.append(f"{m.type}: {m.text[:160]}") if m.type == "error" else None)
        ap.on("pageerror", lambda e: console.append(f"PAGEERROR: {str(e)[:200]}"))
        dialogs = []
        ap.on("dialog", lambda d: (dialogs.append(d.message), d.accept()))
        for i in range(5):
            sign_in(ap, "wrong-password")
            expect(ap.get_by_text("Invalid email or password.")).to_be_visible(timeout=8000)
        check("login: generic message after each of 5 wrong passwords", True)
        print("   stored failures:", requests.get(f"{MOCK}/rest/v1/admin_security?id=eq.1&select=failed_attempts,locked_until").text)
        sign_in(ap, "wrong-password")
        expect(ap.get_by_text("Too many failed attempts", exact=False)).to_be_visible(timeout=8000)
        check("login: locked after 5 wrong attempts", True)
        sign_in(ap, PASSWORD)
        expect(ap.get_by_text("Too many failed attempts", exact=False)).to_be_visible(timeout=8000)
        check("login: correct password refused while locked", True)
        requests.delete(f"{MOCK}/rest/v1/admin_security?id=eq.1")  # clear the lock for the rest of the test
        sign_in(ap, PASSWORD)
        ap.wait_for_url(re.compile(r"^" + re.escape(BASE) + r"/?$"), timeout=10000)
        if ap.locator("[aria-label='Admin toolbar']").count() == 0:
            ap.wait_for_load_state("load")
            ap.wait_for_timeout(2500)
            print("   toolbar missing | url:", ap.url, "| body:", ap.evaluate("document.body.className"), "| errors:", console[-4:])
        expect(ap.locator("[aria-label='Admin toolbar']")).to_be_visible(timeout=8000)
        check("login: signed in, toolbar shown", True)
        cookies = [c for c in admin.cookies() if c["name"] == "hkbk_admin"]
        check("session cookie is httpOnly", cookies and cookies[0]["httpOnly"])

        # 2. Edit a heading on the live page and check it is saved and visible to visitors.
        ap.get_by_role("switch", name=re.compile("Edit page")).click()
        check("edit mode switched on", ap.locator("body.cms-edit").count() == 1)
        h1 = ap.locator("h1[data-cms='text']").first
        h1.click()
        ap.keyboard.press("Control+A")
        ap.keyboard.type("Test heading 123")
        ap.keyboard.press("Enter")
        expect(ap.locator("[aria-label='Admin toolbar']").get_by_text("Saved", exact=False)).to_be_visible(timeout=8000)
        check("text: saved indicator shown", True)
        ap.reload(wait_until="load")
        ap.wait_for_selector("h1[data-cms='text']")
        check("text: still there after reload", ap.locator("h1").first.inner_text().strip() == "Test heading 123")
        vp2 = visitor.new_page()
        vp2.goto(BASE + "/", wait_until="load")
        check("text: visitor sees the new heading", vp2.locator("h1").first.inner_text().strip() == "Test heading 123")
        vp2.close()

        # 3. Sanitising: markup pasted into a paragraph is stored as plain text.
        para = ap.locator("p[data-cms='text']").first
        para.click()
        ap.keyboard.press("Control+A")
        ap.keyboard.type('Safe <img src=x onerror="alert(1)">Hello')
        ap.keyboard.press("Enter")
        ap.wait_for_timeout(1200)
        ap.reload(wait_until="load")
        ap.wait_for_selector("p[data-cms='text']")
        check("sanitise: no image element injected", ap.locator("p img").count() == 0 and ap.locator("img[onerror]").count() == 0)
        check("sanitise: plain text kept", "Hello" in ap.locator("p[data-cms='text']").first.inner_text())

        # 4. Champions: add, delete, reorder, replace a photo, undo, then history restore.
        ap.goto(BASE + "/ai-quantum/champions", wait_until="load")
        ap.wait_for_selector("#faculty-champions li")
        expect(ap.locator("#faculty-champions h2").first).to_have_text(re.compile(r"\(15\)"), timeout=8000)
        check("champions: 15 cards", True)
        ap.get_by_role("button", name="+ Add champion").click()
        expect(ap.locator("#faculty-champions h2").first).to_have_text(re.compile(r"\(16\)"), timeout=8000)
        check("champions: add updates the heading count", True)
        ap.locator("#faculty-champions ul > li").last.get_by_role("button", name="Delete card").click()
        expect(ap.locator("#faculty-champions h2").first).to_have_text(re.compile(r"\(15\)"), timeout=8000)
        check("champions: delete updates the heading count", True)
        ap.get_by_role("button", name="Move Faculty Champion 1 later").click()
        expect(ap.locator("#faculty-champions ul > li").nth(1)).to_contain_text("Aryalekshmi", timeout=8000)
        check("champions: reorder saved", True)
        ap.locator("input[aria-label='Choose a photo for Faculty Champion 2']").set_input_files(PHOTO)
        ap.get_by_role("button", name="Use this photo").click()
        expect(ap.locator("#faculty-champions ul > li").nth(1).locator("img")).to_have_attribute("src", re.compile("site-images/cms/"), timeout=15000)
        check("champions: photo replaced and uploaded", True)
        ap.get_by_role("button", name="Undo").click()
        ap.wait_for_timeout(1500)
        check("undo: last change (photo) reverted", "site-images/cms/" not in (ap.locator("#faculty-champions ul > li").nth(1).locator("img").get_attribute("src") or ""))
        ap.reload(wait_until="load")
        ap.wait_for_selector("#faculty-champions li")
        check("champions: order survives a reload", "Aryalekshmi" in ap.locator("#faculty-champions ul > li").nth(1).inner_text())

        # 5. History: set the heading again, then restore the earlier version from history.
        ap.goto(BASE + "/", wait_until="load")
        ap.locator("h1[data-cms='text']").first.click()
        ap.keyboard.press("Control+A")
        ap.keyboard.type("Second version")
        ap.keyboard.press("Enter")
        ap.wait_for_timeout(1200)
        ap.get_by_role("button", name="History").click()
        dlg = ap.get_by_role("dialog")
        expect(dlg).to_be_visible(timeout=8000)
        check("history: lists recent changes", dlg.get_by_role("button", name="Restore").count() >= 3)
        row = dlg.locator("div", has_text="Test heading 123").filter(has=ap.get_by_role("button", name="Restore")).last
        row.get_by_role("button", name="Restore").click()
        ap.keyboard.press("Escape")
        ap.wait_for_timeout(1500)
        ap.reload(wait_until="load")
        check("history: restored the earlier version", ap.locator("h1").first.inner_text().strip() == "Test heading 123")

        # 6. Server-side checks: the upload endpoint refuses anyone without a session, and rejects bad files.
        anon = visitor.request
        r = anon.post(f"{BASE}/api/admin/upload", multipart={"file": {"name": "a.jpg", "mimeType": "image/jpeg", "buffer": b"\xff\xd8\xff" + b"0" * 100}})
        check("api: upload refused when signed out (401)", r.status == 401, str(r.status))
        r = ap.request.post(f"{BASE}/api/admin/upload", multipart={"file": {"name": "x.txt", "mimeType": "text/plain", "buffer": b"hello"}})
        check("api: text file refused (415)", r.status == 415, str(r.status))
        big = b"\xff\xd8\xff" + b"0" * (6 * 1024 * 1024)
        r = ap.request.post(f"{BASE}/api/admin/upload", multipart={"file": {"name": "big.jpg", "mimeType": "image/jpeg", "buffer": big}})
        check("api: files over 5 MB refused (413)", r.status == 413, str(r.status))

        # 7. Sign out: toolbar goes, visitors see nothing, the session no longer works.
        ap.get_by_role("button", name="Sign out").click()
        ap.wait_for_timeout(1500)
        ap.goto(BASE + "/", wait_until="load")
        check("sign out: toolbar gone", ap.locator("[aria-label='Admin toolbar']").count() == 0)
        r = ap.request.post(f"{BASE}/api/admin/upload", multipart={"file": {"name": "a.jpg", "mimeType": "image/jpeg", "buffer": b"\xff\xd8\xff" + b"0" * 100}})
        check("sign out: old session refused (401)", r.status == 401, str(r.status))
        browser.close()

    failed = [n for n, ok in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())

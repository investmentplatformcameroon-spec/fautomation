console.log = () => {};
console.warn = () => {};
console.error = () => {};

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { Redis } = require('@upstash/redis');
const { execSync, spawn } = require("child_process");
const net = require('net');
//test20

async function startTor() {
  try {
    execSync('curl --socks5 127.0.0.1:9050 --max-time 5 https://icanhazip.com', { stdio: 'pipe' });
    console.log('Tor is already running');
  } catch {
    console.log('Starting Tor...');
    const tor = spawn('tor', [], { detached: true, stdio: 'ignore' });
    tor.unref();
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('Tor started');
   }


}

 process.on('unhandledRejection', (reason) => {
  console.log('⚠️ Unhandled rejection caught:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('⚠️ Uncaught exception caught:', err.message);
});

(async () => {
  await startTor()

    function getChromiumPath() {
      try {
        const candidates = [
          "chromium-browser",
          "chromium",
          "google-chrome",
          "chrome",
        ];
        for (const cmd of candidates) {
          try {
            const path = execSync(`which ${cmd}`, { stdio: "pipe" })
              .toString()
              .trim();
            if (path) return path;
          } catch {}
        }
      } catch (err) {
        console.error("Error finding chromium path:", err);
      }
      return null;
    }

    const executablePath = getChromiumPath();


  const redis = new Redis({
    url: "https://able-bear-84589.upstash.io",
    token: "gQAAAAAAAUptAAIncDE2YmNjNzYxNmYzNDI0MDAyOTE3ZGEzNmQzYzhkMjM2ZXAxODQ1ODk",
  });




const registration_names = fs
  .readFileSync("registration_names.txt", "utf8")
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean); // remove empty lines

let firstname, lastname;

function getRandomName(){
const randomName = registration_names[Math.floor(Math.random() * registration_names.length)];

([firstname, lastname] = randomName.split(" "));
}



    async function humanClick(page, selector) {
    const el = await page.waitForSelector(selector, { visible: true });
    const box = await el.boundingBox();

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // Move from a random starting point to the element with natural steps
    const startX = cx + (Math.random() * 200 - 100);
    const startY = cy + (Math.random() * 200 - 100);

    await page.mouse.move(startX, startY);
    await page.mouse.move(cx, cy, { steps: 10 + Math.floor(Math.random() * 20) });
    await new Promise(r => setTimeout(r, 50 + Math.random() * 150));
    await page.mouse.click(cx, cy);
  }

function randomString(len = 16) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return [...Array(len)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function saveAccountDetails(email, password) {
    const folder = path.join(process.cwd(), "newAccountsLists");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const filepath = path.join(folder, "accounts.txt");
    fs.appendFileSync(filepath, `${email} | ${password}\n | ${firstname} ${lastname}`);
}

async function saveCookies(page) {
    const folder = path.join(process.cwd(), "confirmEmailSessions");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const filename = randomString() + ".json";
    const filepath = path.join(folder, filename);

    const cookies = await page.cookies();
    fs.writeFileSync(filepath, JSON.stringify(cookies, null, 2));

    console.log("Cookies saved:", filepath);
}

async function waitForRealEmail(page) {
    return await page.waitForFunction(() => {
        const el = document.querySelector('#mail_address');
        if (!el) return false;
        const v = el.value.trim().toLowerCase();
       // MUST be > 0 characters
        if (v.length === 0) return false;
       // MUST NOT contain "loading"
        if (v.includes("loading")) return false;
       // Good value: return original (not lowercased)
        return el.value.trim();
    });
}


async function humanLikeMouseMove(page, x1, y1, x2, y2) {
    await page.mouse.move(x1, y1, { steps: 5 + Math.floor(Math.random() * 10) });
    await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    await page.mouse.move(x2, y2, { steps: 5 + Math.floor(Math.random() * 10) });
}

async function clickElementHumanLike(page, elHandle) {
    const box = await elHandle.boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await humanLikeMouseMove(page, box.x, box.y, cx, cy);
    await page.mouse.down();
    await page.mouse.up();
}

function generateRandomEmail() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const name = [...Array(10)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${name}@gmail.com`;
}

let accountCounter = 0;
// ------------------------------------------------------------
//  MAIN ACCOUNT CREATION PROCESS WRAPPED IN A FUNCTION
// ------------------------------------------------------------
    puppeteer.use(StealthPlugin());
          const browser = await puppeteer.launch({
          headless: true,
          executablePath,
          defaultViewport: null,
          permissions: ['geolocation'],
          args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1600,900",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--disable-dev-shm-usage",
      "--lang=en-US,en;q=0.9",
      "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      '--ignore-certificate-errors',
            '--proxy-server=socks5://127.0.0.1:9050'
    ],

    ignoreHTTPSErrors: true
        });


    await browser.defaultBrowserContext().overridePermissions(
  'https://www.facebook.com',
  ['geolocation']
);

async function createAccount() {
    console.log("\n-----------------------------");
    console.log("🔁 Starting new loop iteration");
    console.log("-----------------------------\n");

 const platform = await browser.createBrowserContext();



    try {

      const facebookPage = await platform.newPage();
      const userEmail = generateRandomEmail();

        /***** end: move off screen ***/

            // ── MOBILE EMULATION ──────────────────────────────────────

            await facebookPage.setUserAgent(
              'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
            );

            await facebookPage.setViewport({
              width: 393,
              height: 851,
              isMobile: true,
              hasTouch: true,
              deviceScaleFactor: 3
            });
            // FIXED: removed the second setViewport({ width:1600, height:900 })
            // that was overwriting the mobile viewport back to desktop

            // ── ANTI-DETECTION ────────────────────────────────────────
            await facebookPage.evaluateOnNewDocument(() => {
              Object.defineProperty(navigator, 'webdriver', { get: () => false });
              window.chrome = { runtime: {} };
              Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
              Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
              Intl.DateTimeFormat.prototype.resolvedOptions = function () {
                return { timeZone: 'America/New_York' };
              };
              const getParameter = WebGLRenderingContext.prototype.getParameter;
              WebGLRenderingContext.prototype.getParameter = function (parameter) {
                if (parameter === 37445) return 'Qualcomm';          // realistic for Galaxy
                if (parameter === 37446) return 'Adreno (TM) 740';  // realistic for S23
                return getParameter(parameter);
              };
            });



            await facebookPage.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

            // ── NAVIGATE ──────────────────────────────────────────────
            // FIXED: using m.facebook.com — with Galaxy UA, facebook.com sometimes
            // still serves the desktop layout on first load
            await facebookPage.goto("https://m.facebook.com", { waitUntil: "networkidle2", timeout: 30000 });

            // ── DECLINE COOKIES ───────────────────────────────────────
            // Cookie wall may or may not appear depending on region.
            // We wait up to 5s for it — if it never shows, we move on.
            try {
              await facebookPage.waitForFunction(() => {
                return [...document.querySelectorAll("div, button, span, a, p")]
                  .some(el => el.textContent.trim().toLowerCase() === "decline optional cookies");
              }, { timeout: 5000 });

              const declineCookies = await facebookPage.evaluateHandle(() => {
                return [...document.querySelectorAll("div, button, span, a, p")]
                  .find(el => el.textContent.trim().toLowerCase() === "decline optional cookies") || null;
              });
              await tapElement(facebookPage, declineCookies);
              console.log("🍪 Declined cookies");
            } catch (err) {
              console.log("🍪 No cookie prompt — skipping");
            }

                await new Promise(r => setTimeout(r, 2000));


      //await facebookPage.click('[aria-label="Create new account"]');
      await humanClick(facebookPage, '[aria-label="Create new account"]');



            await new Promise(r => setTimeout(r, 5000));



        //await facebookPage.click('[aria-label="Create new account"]');
        await humanClick(facebookPage, '[aria-label="Create new account"]');



                await new Promise(r => setTimeout(r, 5000));







            // Confirm the registration form fields are present
            await facebookPage.waitForFunction(() => {
              return document.querySelectorAll('input').length >= 2;
            }, { timeout: 15000 });

            console.log("📋 Registration form loaded");



            // ── DECLINE COOKIES (may re-appear after modal opens) ─────
            try {
              const declineCookies = await facebookPage.evaluateHandle(() => {
                return [...document.querySelectorAll("div, button, span, a, p")]
                  .find(el => el.textContent.trim().toLowerCase() === "decline optional cookies") || null;
              });
              await tapElement(facebookPage, declineCookies);
            } catch (err) { }

            // ── MONITOR MOBILE ERROR MESSAGES ─────────────────────────
            // FIXED: #reg_error_inner is a desktop-only element ID.
            // Mobile FB shows errors in role="alert" or data-sigil="m-form-error".
            async function monitorError() {
              const CHECK_INTERVAL_MS = 500;
              while (true) {
                try {
                  const message = await facebookPage.evaluate(() => {
                    const selectors = [
                      '[role="alert"]',
                      '[data-sigil="m-form-error"]',
                      '.mvm.uiP.fsm',
                    ];
                    for (const sel of selectors) {
                      const el = document.querySelector(sel);
                      if (!el) continue;
                      const rect = el.getBoundingClientRect();
                      if (rect.width > 0 && rect.height > 0) return el.textContent.trim();
                    }
                    return null;
                  });
                  if (message) {
                    console.log('Facebook Error:', message);
                    await browser.close(); // close just this context, not the whole browser
                    return;
                  }
                } catch (err) { /* page may have navigated */ }
                await new Promise(r => setTimeout(r, CHECK_INTERVAL_MS));
              }
            }
            monitorError();

            // ── FILL NAME FIELDS ──────────────────────────────────────
            // FIXED: named selectors instead of positional $$('input')[n]
            // Mobile form field order can vary — name attributes are stable.


                await new Promise(r => setTimeout(r, 5000));


          await facebookPage.type('input[aria-label="First name"]', firstname, { delay: 80 });

          await facebookPage.type('input[aria-label="Last name"]', lastname, { delay: 80 });


            await new Promise(r => setTimeout(r, 1000));

          const Next1 = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "next") || null;
              });


        //  await tapElement(facebookPage, Next1);

          await humanClick(facebookPage, '[aria-label="Next"]');


                    await new Promise(r => setTimeout(r, 1000));

          await facebookPage.waitForSelector('input[aria-label^="Birthday"]', { visible: true });

          await facebookPage.evaluate(() => {
        const input = document.querySelector('input[aria-label^="Birthday"]');
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, '1993-03-04');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });


      await new Promise(r => setTimeout(r, 1000));

          const Next2 = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "next") || null;
              });


        //  await tapElement(facebookPage, Next2);
            await humanClick(facebookPage, '[aria-label="Next"]');


          await facebookPage.waitForSelector('[aria-label="Female"]');

          //await tapElement(facebookPage, await facebookPage.$('[aria-label="Female"]'));

                await humanClick(facebookPage, '[aria-label="Female"]');



            const Next3 = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "next") || null;
              });


         // await tapElement(facebookPage, Next3);
            await humanClick(facebookPage, '[aria-label="Next"]');


          await facebookPage.waitForSelector('[aria-label="Sign up with email"]');


          const signUpWithEmail = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "sign up with email") || null;
              });


         // await tapElement(facebookPage, signUpWithEmail);
            await humanClick(facebookPage, '[aria-label="Sign up with email"]');



          await facebookPage.waitForSelector('[aria-label="Email"]');

          await facebookPage.type('input[aria-label="Email"]', userEmail);

            const Next4 = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "next") || null;
              });


         // await tapElement(facebookPage, Next4);
              await humanClick(facebookPage, '[aria-label="Next"]');





          await facebookPage.waitForSelector('[aria-label="Password"]');

          await facebookPage.type('input[aria-label="Password"]', "12@#ENgineer", { delay: 80 });

            const Next5 = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "next") || null;
              });


        //  await tapElement(facebookPage, Next5);
              await humanClick(facebookPage, '[aria-label="Next"]');



          await facebookPage.waitForSelector('[aria-label="Not now"]');



            const notNow = await facebookPage.evaluateHandle(() => {
                  return [...document.querySelectorAll("a, div, button, span")]
                      .find(el => el.textContent.trim().toLowerCase() === "not now") || null;
              });


          //await tapElement(facebookPage, notNow);

                  await humanClick(facebookPage, '[aria-label="Not now"]');


            await facebookPage.waitForSelector('[aria-label="I agree"]');

            const iAgree = await facebookPage.$('[aria-label="I agree"]');


            //  await tapElement(facebookPage, iAgree);

                    await humanClick(facebookPage, '[aria-label="I agree"]');

           await facebookPage.waitForSelector('[aria-label="I didn’t get the code"]');



           const url = facebookPage.url();
         if (url.toLowerCase().includes('confirm')) {
               accountCounter++;
            console.log("📋 Account Trials: "+accountCounter);

              const filename = randomString() + ".json";
              const cookies = await facebookPage.cookies();		 

             await redis.lpush('facebook-accounts', JSON.stringify({
              filename: filename,
              data: cookies,
              timestamp: Date.now(),
              name: `${firstname} ${lastname}`
            }));
          }


    }

    catch (err) {
        console.log("❌ ERROR in loop iteration:", err.message);
    }

    finally {
        await platform.close();
    }
}


// ------------------------------------------------------------
//  INFINITE LOOP — RUNS FOREVER UNTIL YOU STOP THE SCRIPT
// ------------------------------------------------------------


async function worker(id) {
  while (true) {
    try {
      console.log(`🚀 Worker ${id} starting...`);
      getRandomName();
      await createAccount();
      console.log(`🔁 Worker ${id} finished`);
    } catch (err) {
      console.log(`❌ Worker ${id} error: ${err.message}, restarting...`);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

const WORKERS = 5;

(async () => {
  await Promise.all(
    Array.from({ length: WORKERS }, (_, i) => worker(i + 1))
  );
})();

})();

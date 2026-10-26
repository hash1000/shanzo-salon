# Shanzo Salon

Run locally: `npm install`, then `npm run dev`.

## Live hours and owner admin

Public QR destination: `https://shanzosalon.com/hours`. Owner login: `/admin/login`.
The admin is not linked in the public navigation or footer and is marked noindex.

**The supplied JSON schedules and public call number are placeholders. Replace
these before publishing.** Contact links remain in `src/data/walk-in-hours.ts`.
Hours now live in `data/walk-in-hours.json`; do not edit schedules in TypeScript.

### Setup (in order)

1. Use a VPS or Node server with a **persistent writable disk**. Set up HTTPS for
   production; the session cookie is secure in production and requires HTTPS.
2. Admin authentication needs no environment variables. The admin email,
   password, and signing secret are constants in `src/lib/admin-credentials.ts`,
   protected by `server-only` and excluded from browser bundles. Keep repository
   access private: anyone with source access can read these constants.
   Optional server settings are documented in `.env.example`; preserve existing
   mail configuration when editing your ignored `.env.local`.
3. Credential or signing-secret changes require a rebuild and process restart
   and invalidate existing sessions. Cookies remain HMAC-signed, HttpOnly,
   SameSite=Strict, and secure in production.
4. Set `HOURS_DATA_PATH` to an absolute persistent path, e.g.
   `/var/lib/shanzo/walk-in-hours.json`, and seed it from `data/walk-in-hours.json`.
   The server user must have read/write access to the file and its parent folder
   (atomic saves create a temporary sibling and rename it). If omitted, the path
   defaults to `data/walk-in-hours.json` relative to the app working directory.
   Keep the live file outside release folders so deployments do not overwrite it;
   include it in your server backups. Missing or invalid JSON safely closes both
   services and shows an unconfirmed-availability banner. A save recreates the file.
5. If using a trusted reverse proxy, configure it to **replace** `X-Forwarded-For`
   with the real client address, then set `ADMIN_TRUST_PROXY_HEADERS=true`.
   Otherwise keep it false: all login attempts share a conservative rate-limit
   bucket. Five failed attempts lock that address/bucket for 15 minutes. Limits
   are in memory, reset on restart, and are per Node process; use a single app
   instance or enforce an additional limit at your proxy for multiple instances.
6. Replace the placeholder call number in `src/data/walk-in-hours.ts`.
7. Run `npm run lint`, `node --test tests/hours-admin.test.mjs`, and `npm run build`.
   Deploy and start/restart the Node server using your existing hosting workflow.
8. Open `/admin/login`, sign in, enter the real hours, and press **Save changes**.
   Sessions last seven days; Logout clears the cookie. Check `/hours` on a phone.

### Updating hours

- Select Hair or Nails. Toggle walk-ins for each day and enter local 24-hour open
  and close times. Add split shifts as needed. Closing must follow opening on the
  same day; overlapping ranges are rejected. Shortcuts copy a weekly schedule or
  apply Monday to every day. Notes are separate for each service.
- Quick closures stage today's Chicago-date override. Reopen removes that
  service's one-off closure and returns to its weekly hours (which may still be
  unavailable). If closing replaced custom hours for today, re-enter those hours
  as an override when reopening.
- Set a banner announcement, or leave it blank to hide it.
- For a one-off date, choose Hair and/or Nails, toggle available/closed, enter any
  hours, and press **Add / replace override** to stage it. This merges with other
  services already overridden for that date. Delete removes the entire date's
  override. Past overrides are ignored and removed on the next save.
- Review the shared-card preview, then press the single **Save changes** button.
  Nothing is published until saved. The server updates `lastUpdated` automatically,
  writes atomically, and calls `revalidatePath("/hours")`. No redeploy is needed
  for admin edits. Reload an already-open public page to see the new hours/status.
  Browser navigation/closing warns about unsaved changes; Logout also confirms.

The server reads and validates JSON fresh on every call. `/hours` uses
`dynamic = "force-dynamic"`, with Chicago timezone and daylight saving handling
shared with the preview. Cache Components and dependent partial prefetching were
turned off because Next 16.4 does not support `force-dynamic` with them enabled.
The stack and dependencies are unchanged.

Manual JSON edits use the same shape as before: `timezone`, ISO `lastUpdated`,
optional `announcement`, `services.hair/nails.weekly` (mon–sun), optional service
`note`, and optional `overrides`. Each day is `null`, `{ "open": "10:00", "close":
"19:00" }`, or a nonempty array of ranges. Use one override per `YYYY-MM-DD` date;
omitted services retain the weekly schedule. Update `lastUpdated` for manual edits.

**Hosting note:** Saving to a file requires a persistent writable disk (VPS or a
Node server). Vercel/Netlify serverless deployment files may be read-only, temporary
files do not persist reliably across instances, and files reset on redeploy. This
file-backed admin is intended for a persistent Node deployment, not serverless.

## Contact email setup

The React contact form posts Name, Email, Message and optional Attachments to
`/api/contact`. The Node.js route validates fields and files, sends through Resend
from `info@shanzosalon.com`, and sets Reply-To to the visitor's email.
Attachments: up to 3 JPG, PNG, WebP, PDF or TXT files, totaling at most 5 MB.

1. In [Resend Domains](https://resend.com/domains), add **shanzosalon.com** and select your sending region.
2. At your domain's DNS provider, copy every sending verification record shown by Resend, including each record's exact type, name, value and MX priority. These include DKIM and SPF/Return-Path records; values depend on your domain and region. Use DNS-only mode for any CNAME records.
3. Preserve your existing mailbox MX records at the root domain. Add Resend's sending MX at the Return-Path hostname it specifies (usually `send`); receiving through Resend is not required. Avoid duplicate SPF records at the same hostname. DNS providers that append your domain need only the relative hostname.
4. Click **I've added the records** in Resend and wait for **Verified**. See [Resend domain setup](https://resend.com/docs/dashboard/domains/manage-domains) for provider-specific instructions.
5. Put these server-only variables in `.env.local` locally and your hosting provider's environment settings in production:

   ```dotenv
   RESEND_API_KEY=your_resend_api_key
   CONTACT_TO_EMAIL=info@shanzosalon.com
   CONTACT_FROM_EMAIL=info@shanzosalon.com
   ```

   The provided key is configured in the ignored local `.env.local`. Never use a `NEXT_PUBLIC_` prefix for it. Restart the dev server or redeploy after configuration. `CONTACT_TO_EMAIL` must be a working inbox; change it if inquiries should go elsewhere. `CONTACT_FROM_EMAIL` is used by the newsletter route; the contact sender is fixed to `info@shanzosalon.com`.
6. Submit the contact form with a small attachment. Check the recipient inbox and [Resend Emails](https://resend.com/emails). Replying should address the visitor.

API responses: `200 { success: true, id }` means Resend accepted the email;
`400` invalid fields/files, `413` oversized body, `503` missing API key,
`502` email provider failure. All failures return `{ error: string }`.

Reference: [Resend Next.js integration](https://resend.com/docs/send-with-nextjs).

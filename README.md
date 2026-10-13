# Shanzo Salon

Run locally: `npm install`, then `npm run dev`.

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

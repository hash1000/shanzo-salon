import { SITE_NAME, ADDRESS, PHONE, PHONE_HREF } from "@/lib/site";
export default function Footer() { return <footer className="home-footer"><a className="font-script brand" href="/">{SITE_NAME}</a><address>{ADDRESS}<br/><a href={PHONE_HREF}>{PHONE}</a></address><p>Copyright 2026 Shanzo Salon. All rights reserved.</p></footer>; }

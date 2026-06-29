# Email signature variants

Standardized signatures for the three email accounts. Use verbatim so the entity graph stays consistent across thousands of sent emails, mailing-list archives, and forwarded threads (all of which feed LLM training pipelines over time).

## Why this matters for SEO/AEO/GEO

Email signatures are a high-volume, low-effort entity signal. Every email you send carries your bio across to whoever receives it. Mailing lists archive publicly. Newsletters are crawled by LLMs. The signature is the same canonical descriptor + the same sameAs chain repeated thousands of times, which is exactly what entity-graph reinforcement looks like at scale.

Three rules:

1. Same canonical sentence on every account
2. Same URLs in the same order on every account
3. Update on the same day across all accounts when anything changes

## Account 1: keith@totalemphasis.com (primary)

**Plain text version:**

```
Keith O'Brien
B2B Content Strategist & Executive Ghostwriter | Former PRWeek EIC
Founder, Total Emphasis | Operator-Ghostwriter for B2B Founders & Executives

keith@totalemphasis.com
totalemphasis.com | keithrobrien.com | linkedin.com/in/keithobrien
```

**HTML / rich-text version (recommended for Gmail / Apple Mail):**

```
<table style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.5; color: #333;">
  <tr>
    <td style="padding-right: 16px; border-right: 2px solid #b9512a;">
      <strong style="font-size: 15px;">Keith O'Brien</strong><br/>
      B2B Content Strategist &amp; Executive Ghostwriter<br/>
      <span style="color: #666;">Former PRWeek Editor-in-Chief</span>
    </td>
    <td style="padding-left: 16px;">
      Founder, <a href="https://www.totalemphasis.com" style="color: #b9512a;">Total Emphasis</a><br/>
      <a href="mailto:keith@totalemphasis.com" style="color: #333; text-decoration: none;">keith@totalemphasis.com</a><br/>
      <a href="https://www.linkedin.com/in/keithobrien/" style="color: #b9512a;">LinkedIn</a> &middot;
      <a href="https://muckrack.com/keithobrien" style="color: #b9512a;">Muck Rack</a> &middot;
      <a href="https://www.keithrobrien.com" style="color: #b9512a;">Personal site</a>
    </td>
  </tr>
</table>
```

## Account 2: keith@141miles.com (141 Miles editorial)

```
Keith O'Brien
Editor & Publisher, 141 Miles
A town-by-town guide to the Jersey Shore

keith@141miles.com
141miles.com | newsletter at 141miles.com/briefing
```

Brief on purpose. 141 Miles is a separate brand. Don't dilute it with the ghostwriting bio.

## Account 3: personal email

```
Keith O'Brien
B2B Executive Ghostwriter | Founder, Total Emphasis
keithrobrien.com
```

Shortest. Personal accounts get fewer touches; signature exists mostly so receivers can verify identity quickly.

## Sign-off conventions

- "Best, Keith" for prospects and clients
- "Thanks, Keith" for collaborators
- "Cheers, Keith" for trade press peers
- No sign-off (just signature) for short transactional replies

## Maintenance

- Re-check signatures **every January 1 and July 1** (same cadence as the off-site profile sweep in [profile-checklist.md](profile-checklist.md))
- When the canonical bio in `vault/120-Resources/Keith O'Brien Experience.md` is updated, propagate within 7 days
- If a new credential or major client (PUBLIC tier) is added, optional inclusion in the signature; keep total signature lines under 6

## Setup notes by client

- **Gmail:** Settings → General → Signature → New. Paste the HTML version. Set as default for the account.
- **Apple Mail:** Settings → Signatures → Choose account → New. Paste the HTML version.
- **Spark / Superhuman:** Settings → Signatures → Paste the HTML version.
- **Mobile devices:** Use the plain text version (HTML rendering inconsistent on mobile).

## What NOT to include

- No taglines like "Sent from my iPhone" (delete by default)
- No motivational quotes
- No social media icons rendered as images (image-only links don't get crawled as URLs by LLMs)
- No vCard attachments (treated as spam, not crawled)
- No PGP key blocks unless you actually want them
- No "Confidentiality notice" boilerplate (legally toothless and adds noise to email archives)

# Business details to confirm

The following business details are currently placeholders or unverified. The business owner must review and confirm each item before publishing the Go Deliver website.

## Contact information

| Detail | Current value | Status | Action |
|--------|---------------|--------|--------|
| WhatsApp number | (empty) | Unverified | Enter the business WhatsApp number with country code, no `+` |
| Business email | (empty) | Unverified | Enter a valid business email address |
| Business phone | (empty) | Unverified | Enter a business phone number |
| Facebook URL | (empty) | Unverified | Enter or leave empty |
| Twitter / X URL | (empty) | Unverified | Enter or leave empty |
| Instagram URL | (empty) | Unverified | Enter or leave empty |

These are configured via the database `ContactInfo` table and can be updated through the admin dashboard at `/admin/contact`.

## Service areas / branches

| Area | Address | Operating hours | Contact phone | Status |
|------|---------|-----------------|---------------|--------|
| City Centre | — | — | — | Unverified |
| Industrial Area | — | — | — | Unverified |
| Residential Estates | — | — | — | Unverified |

Do not claim coverage in any area until confirmed. Update through the admin dashboard at `/admin/areas`.

## Services and pricing

| Service | Description | Starting price | Status |
|---------|-------------|----------------|--------|
| Parcel & Document Delivery | — | Not set | Unverified |
| Business Deliveries | — | Not set | Unverified |
| Food & Retail Deliveries | — | Not set | Unverified |
| Same-Day Delivery | — | Not set | Unverified |

**Important:** The website does **not** display currency symbols or currency codes. Prices are stored and shown as numbers only. Confirm all prices with the business owner before publishing. Update through the admin dashboard at `/admin/services`.

## Legal pages

The Privacy and Terms pages are starter templates. They:
- Are not reviewed by a lawyer
- Are not legal advice
- Must be customised and confirmed by the business owner before publication

## First admin credentials

| Detail | Default value | Action |
|--------|---------------|--------|
| Email | admin@go-deliver.local | Change after first login |
| Password | ChangeMe123! | Change immediately after first login |

These are set via `FIRST_ADMIN_EMAIL` and `FIRST_ADMIN_PASSWORD` in `backend/.env`.

## How to update confirmed details

1. Start the backend and frontend.
2. Seed or access the database.
3. Log in to the admin dashboard at `/admin/login`.
4. Update services, areas, FAQs, and contact info as needed.
5. All changes are stored in the PostgreSQL database and persist across restarts.

## Reminder

Do not publish unverified phone numbers, emails, addresses, prices, or service areas as confirmed company information.

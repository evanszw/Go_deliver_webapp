export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Privacy information</h1>
        <p className="text-brand-grey mt-2">
          How Go Deliver handles your information.
        </p>
      </div>
      <div className="prose prose-brand-grey max-w-none">
        <h2 className="font-bold text-brand-black mt-6 mb-3">1. Information we collect</h2>
        <p>
          When you submit a delivery request or contact us, we collect your name, phone number, email
          address (if provided), pickup and delivery addresses, item description, and any delivery
          instructions. This information is used solely to process your delivery request.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">2. How we use your information</h2>
        <p>
          Your details are used to process and manage delivery requests, contact you about your delivery,
          and improve our service. We do not sell your personal information.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">3. Data storage</h2>
        <p>
          Delivery requests are stored in our database for operational and record-keeping purposes. Access
          is restricted to authorised staff.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">4. WhatsApp</h2>
        <p>
          If you choose to contact us via WhatsApp, your message is handled by WhatsApp under their own
          terms and privacy policy. Go Deliver does not control WhatsApp&rsquo; data processing.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">5. Contact</h2>
        <p>
          If you have questions about this privacy information, contact us through the Contact page.
        </p>
        <p className="mt-6 text-xs text-brand-grey/50 italic">
          This is a starter privacy page. It must be reviewed and confirmed by the business owner before
          publication. It is not legal advice.
        </p>
      </div>
    </div>
  );
}

export default Privacy;

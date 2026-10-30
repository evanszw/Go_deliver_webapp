export function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Terms of service</h1>
        <p className="text-brand-grey mt-2">
          Terms governing the use of Go Deliver&rsquo;s delivery request service.
        </p>
      </div>
      <div className="prose prose-brand-grey max-w-none">
        <h2 className="font-bold text-brand-black mt-6 mb-3">1. Service description</h2>
        <p>
          Go Deliver provides a delivery request booking service. Submitting a request does not guarantee
          delivery; each request is reviewed and confirmed by our team.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">2. Booking requests</h2>
        <p>
          You must provide accurate information when submitting a delivery request. Incomplete or inaccurate
          details may delay or prevent delivery.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">3. Pricing</h2>
        <p>
          Delivery prices are confirmed before dispatch. Displayed amounts are estimates only and do not
          include any currency symbol or code. Contact us for a confirmed quote.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">4. No payments online</h2>
        <p>
          This website does not process payments. Payment arrangements are made directly with Go Deliver.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">5. Limitations</h2>
        <p>
          We do not offer live tracking, courier location sharing, or automated delivery status. Your
          reference number is for internal identification and use when contacting us.
        </p>
        <h2 className="font-bold text-brand-black mt-6 mb-3">6. Contact</h2>
        <p>
          For questions about these terms, contact us through the Contact page.
        </p>
        <p className="mt-6 text-xs text-brand-grey/50 italic">
          This is a starter terms page. It must be reviewed and confirmed by the business owner before
          publication. It is not legal advice.
        </p>
      </div>
    </div>
  );
}

export default Terms;

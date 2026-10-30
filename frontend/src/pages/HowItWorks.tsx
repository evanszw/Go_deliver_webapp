export function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-black mb-8">How it works</h1>
      <div className="space-y-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="flex gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center text-lg font-bold">
              {n}
            </div>
            <div>
              <h3 className="font-bold text-brand-black text-lg mb-2">Step {n}</h3>
              <p className="text-brand-grey leading-relaxed">
                {n === 1 && "Select the required delivery service from our catalogue."}
                {n === 2 && "Enter your pickup address and delivery destination."}
                {n === 3 && "Provide your contact information and any delivery instructions."}
                {n === 4 && "Review your request summary before submitting."}
                {n === 5 && "Submit your request through our booking workflow."}
                {n === 6 && "Receive a reference number and confirmation of next steps."}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 bg-brand-light-bg rounded-xl border border-brand-black/10">
        <h3 className="font-bold text-brand-black mb-3">Important notes</h3>
        <ul className="text-brand-grey text-sm space-y-2 list-disc pl-5">
          <li>Your request is saved and reviewed by our team.</li>
          <li>You will receive a reference number to use when contacting us.</li>
          <li>We do not offer live tracking or automated dispatch status.</li>
          <li>Prices are confirmed before dispatch.</li>
        </ul>
      </div>
    </div>
  );
}

export default HowItWorksPage;

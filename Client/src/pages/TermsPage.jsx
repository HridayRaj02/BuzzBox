import Page from "../components/Page";

export default function TermsPage() {
  return (
    <Page
      title="Terms & conditions"
      eyebrow="STARTER COPY · NEEDS OPERATOR REVIEW"
      description="This editable starter content is not legal advice and is not approved policy text."
    >
      <article className="panel legal">
        <h2>Using this demo</h2>
        <p>
          BuzzBox is presented here as a frontend demonstration. Event listings,
          organizer tools, coupons, notifications, bookings, and profile records
          shown in this demo are sample content stored locally in your browser.
        </p>
        <h2>Events, bookings, and payments</h2>
        <p>
          No payment provider, ticket validation service, email delivery, or
          account service is connected. A demo checkout does not charge money
          and a generated ticket is not valid for entry.
        </p>
        <h2>Before publication</h2>
        <p>
          The operator must provide their legal name and contact details,
          establish real event, cancellation, refund, and payment terms, and
          obtain qualified legal review before using this page in a public
          service.
        </p>
        <p className="demo-note">
          Draft placeholder for product development. Not legally reviewed.
        </p>
      </article>
    </Page>
  );
}

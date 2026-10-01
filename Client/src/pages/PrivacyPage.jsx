import Page from "../components/Page";

export default function PrivacyPage() {
  return (
    <Page
      title="Privacy policy"
      eyebrow="STARTER COPY · NEEDS OPERATOR REVIEW"
      description="This editable starter content is not legal advice and is not approved policy text."
    >
      <article className="panel legal">
        <h2>What this demo stores</h2>
        <p>
          This frontend demonstration stores preferences, saved events, sample
          notifications, and demo bookings in local browser storage on this
          device. It does not send these details to a server.
        </p>
        <h2>Services and retention</h2>
        <p>
          No analytics, email, payment, or account service is connected. Browser
          storage can be cleared using your browser settings. A real operator
          should describe any connected providers, purposes, retention periods,
          and user choices here.
        </p>
        <h2>Before publication</h2>
        <p>
          The platform operator must add their legal name and contact details,
          explain actual data handling, and obtain qualified legal review before
          using this page in a public service.
        </p>
        <p className="demo-note">
          Draft placeholder for product development. Not legally reviewed.
        </p>
      </article>
    </Page>
  );
}

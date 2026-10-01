import useApp from "../state/useApp";
import Page from "../components/Page";

export default function NotFoundPage() {
  const { go } = useApp();
  return (
    <Page
      title="This page isn't here"
      eyebrow="404"
      description="That link may have moved. The next good plan is a click away."
    >
      <button className="button primary" onClick={() => go("/")}>
        Back to Explore
      </button>
    </Page>
  );
}

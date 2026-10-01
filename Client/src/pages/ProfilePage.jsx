import useApp from "../state/useApp";
import Page from "../components/Page";

export default function ProfilePage() {
  const {
    profile,
    setProfile,
    formError,
    setFormError,
    notice,
    setNotice,
    go,
  } = useApp();
  const save = (event) => {
    event.preventDefault();
    if (!profile.name.trim()) {
      setFormError("Please enter a name.");
      return;
    }
    setFormError("");
    setNotice("Your demo preferences have been saved.");
  };
  return (
    <Page
      title="Your profile"
      eyebrow="A FEW DETAILS ABOUT YOU"
      description="Edit your local demo preferences."
    >
      <form className="panel profile-form" onSubmit={save}>
        <label className="field-label">
          Name
          <input
            required
            value={profile.name}
            onChange={(event) =>
              setProfile({ ...profile, name: event.target.value })
            }
          />
        </label>
        <label className="field-label">
          Email
          <input
            type="email"
            value={profile.email}
            onChange={(event) =>
              setProfile({ ...profile, email: event.target.value })
            }
            placeholder="name@example.com"
          />
        </label>
        <label className="field-label">
          Home city
          <select
            value={profile.city}
            onChange={(event) =>
              setProfile({ ...profile, city: event.target.value })
            }
          >
            <option>Delhi</option>
            <option>Noida</option>
            <option>Gurugram</option>
            <option>Other</option>
          </select>
        </label>
        {formError && (
          <p className="error-text" role="alert">
            {formError}
          </p>
        )}
        {notice && (
          <p className="success-text" role="status">
            {notice}
          </p>
        )}
        <button className="button primary">Save preferences</button>
        <button
          type="button"
          className="text-link"
          onClick={() => go("/login")}
        >
          Open the demo sign-in flow
        </button>
        <p className="demo-note">
          These settings are stored only in local browser storage. No account
          service is connected.
        </p>
      </form>
    </Page>
  );
}

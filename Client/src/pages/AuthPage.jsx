import useApp from "../state/useApp";
import Page from "../components/Page";

export default function AuthPage({ mode }) {
  const { authMode, setAuthMode, go, notice, setNotice } = useApp();
  const reset = mode === "forgot-password";
  const title = reset ? "Reset your password" : "Good to have you here.";
  const submit = (event) => {
    event.preventDefault();
    setNotice(
      reset
        ? "If this were connected, reset instructions would be sent."
        : "Demo sign-in complete. Welcome to BuzzBox.",
    );
  };
  return (
    <Page
      title={title}
      eyebrow="BUZZBOX ACCOUNT"
      description="Demo account flow. No password is stored or sent to a server."
    >
      <form className="panel auth-form" onSubmit={submit}>
        <div className="auth-tabs">
          {["Sign in", "Create account"].map((item) => (
            <button
              type="button"
              key={item}
              className={authMode === item ? "selected-tab" : ""}
              onClick={() => {
                setAuthMode(item);
                go(item === "Sign in" ? "/login" : "/signup");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        {mode === "signup" && (
          <label className="field-label">
            Name
            <input required minLength="2" placeholder="Your name" />
          </label>
        )}
        <label className="field-label">
          Email
          <input type="email" required placeholder="name@example.com" />
        </label>
        {!reset && (
          <label className="field-label">
            Password
            <input
              type="password"
              required
              minLength="8"
              placeholder="At least 8 characters"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </label>
        )}
        {mode === "login" && (
          <button
            type="button"
            className="text-link"
            onClick={() => go("/forgot-password")}
          >
            Forgot password?
          </button>
        )}
        {notice && (
          <p className="success-text" role="status">
            {notice}
          </p>
        )}
        <button className="button primary full">
          {reset
            ? "Send reset link"
            : mode === "signup"
              ? "Create demo account"
              : "Sign in to demo"}
        </button>
        <p className="demo-note">
          Authentication is a frontend demonstration only. Spam and bot
          protection requires server-side support.
        </p>
      </form>
    </Page>
  );
}

export default function Empty({ title, body, action, onAction }) {
  return (
    <div className="empty">
      <span aria-hidden="true">✳</span>
      <h2>{title}</h2>
      <p>{body}</p>
      <button className="button primary" onClick={onAction}>
        {action}
      </button>
    </div>
  );
}

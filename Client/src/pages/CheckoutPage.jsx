import useApp from "../state/useApp";
import Page from "../components/Page";

export default function CheckoutPage() {
  const {
    chosen,
    qty,
    setQty,
    coupon,
    setCoupon,
    coupons,
    subtotal,
    discount,
    applied,
    setApplied,
    couponPercent,
    setCouponPercent,
    formError,
    setFormError,
    money,
    payDemo,
    go,
  } = useApp();
  const applyCoupon = () => {
    const found = coupons.find(
      (item) => item.code === coupon.trim().toUpperCase(),
    );
    if (found && subtotal >= Number(found.minimum)) {
      setApplied(true);
      setCouponPercent(Number(found.percent));
      setFormError("");
    } else {
      setApplied(false);
      setFormError(
        found
          ? `This code requires a minimum order of ${money(found.minimum)}.`
          : "That demo code is not valid.",
      );
    }
  };
  return (
    <Page
      title="A little closer to going"
      eyebrow="CHECKOUT · DEMO"
      description="Review your tickets before continuing."
    >
      <div className="checkout-grid">
        <div className="panel">
          <div className="checkout-event">
            <div className={`mini-art ${chosen.art}`}></div>
            <div>
              <h3>{chosen.title}</h3>
              <p>
                {chosen.date} · {chosen.time}
              </p>
              <p>{chosen.place}</p>
            </div>
          </div>
          <label className="field-label">
            Tickets{" "}
            <span className="quantity inline">
              <button
                type="button"
                aria-label="Decrease tickets"
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              >
                −
              </button>
              <b>{qty}</b>
              <button
                type="button"
                aria-label="Increase tickets"
                onClick={() => setQty((value) => Math.min(8, value + 1))}
              >
                +
              </button>
            </span>
          </label>
          <label className="field-label" htmlFor="coupon">
            Demo coupon
          </label>
          <div className="coupon-row">
            <input
              id="coupon"
              value={coupon}
              onChange={(event) => {
                setCoupon(event.target.value);
                setApplied(false);
              }}
              placeholder="Try WELCOME10"
            />
            <button
              type="button"
              className="button secondary"
              onClick={applyCoupon}
            >
              Apply
            </button>
          </div>
          {applied && (
            <p className="success-text" role="status">
              {coupon.trim().toUpperCase()} applied: {couponPercent}% off this
              demo order.
            </p>
          )}
          {formError && (
            <p className="error-text" role="alert">
              {formError}
            </p>
          )}
          <p className="demo-note">
            This checkout is a local demo. No payment provider is connected and
            no money will be charged.
          </p>
        </div>
        <aside className="panel order-panel">
          <p className="eyebrow">ORDER SUMMARY</p>
          <h3>{qty} × General admission</h3>
          <div className="sum-line">
            <span>Tickets</span>
            <b>{money(subtotal)}</b>
          </div>
          {applied && (
            <div className="sum-line discount">
              <span>Demo discount</span>
              <b>−{money(discount)}</b>
            </div>
          )}
          <div className="sum-line total">
            <span>Total</span>
            <b>{money(subtotal - discount)}</b>
          </div>
          <button className="button primary full" onClick={payDemo}>
            Complete demo booking
          </button>
          <button
            className="text-link back-center"
            onClick={() => go("/event")}
          >
            Back to event
          </button>
        </aside>
      </div>
    </Page>
  );
}

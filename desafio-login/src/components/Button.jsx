import Loading from "../assets/Loading";

function Button({ type, children, onClick, disabled, loading }) {
  return (
    <button
      className="button"
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <Loading className="loading-spinner" /> : children}
    </button>
  );
}

export default Button;
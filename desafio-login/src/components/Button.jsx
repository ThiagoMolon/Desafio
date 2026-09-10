
function Button({ type, children, onClick, disabled }) {
    return (
        <button className="form__button" type={type} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;
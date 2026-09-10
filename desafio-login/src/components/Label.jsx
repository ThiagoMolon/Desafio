

function Label({ htmlFor, children }) {
    return (
        <label className="form__label" htmlFor={htmlFor}>
            {children}:
        </label>
    );
}

export default Label;
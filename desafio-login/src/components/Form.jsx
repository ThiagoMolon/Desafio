import React from 'react';

function Form({ action, method, onSubmit, children }) {
    return (
        <form className="form" action={action} method={method} onSubmit={onSubmit}>
            {children}
        </form>
    );
}

export default Form;
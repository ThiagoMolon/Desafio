import React from 'react';


function Input({ name, type, placeholder, value, setState }) {
    return (
        <input className="form__input"
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setState(e.target.value)}
        />
    );
}

export default Input;
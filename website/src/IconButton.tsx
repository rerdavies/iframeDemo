import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string ;
};
function IconButton(props : IconButtonProps) {
    const { icon, style, ...extras } = props;

    return (
        <button className="icon-button"
            {...extras}
            style={{
                ...style,
            }}
        >
            <span className="material-symbols-outlined">{icon}</span>
        </button>
    );
}

export default IconButton;
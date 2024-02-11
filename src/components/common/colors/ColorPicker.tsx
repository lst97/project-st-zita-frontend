import React from 'react';
import { MuiColorInput } from 'mui-color-input';

const ColorPicker = ({
    onChange,
    initialColor
}: {
    onChange: (hexcode: string) => void;
    initialColor?: string;
}) => {
    const [value, setValue] = React.useState<string>(initialColor ?? '#0055AA');

    const handleColorChange = (newValue: string) => {
        onChange(newValue);
        setValue(newValue);
    };

    return <MuiColorInput value={value} onChange={handleColorChange} />;
};

export default ColorPicker;

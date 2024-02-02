import React from 'react';
import { MuiColorInput } from 'mui-color-input';

const ColorPicker = ({ onChange }: { onChange: (hexcode: string) => void }) => {
    const [value, setValue] = React.useState<string>('#0055AA');

    const handleColorChange = (newValue: string) => {
        onChange(newValue);
        setValue(newValue);
    };

    return <MuiColorInput value={value} onChange={handleColorChange} />;
};

export default ColorPicker;

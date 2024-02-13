import React, { useEffect } from 'react';
import { MuiColorInput } from 'mui-color-input';
import useTheme from '@mui/material/styles/useTheme';

const ColorPicker = ({
    onChange,
    initialColor
}: {
    onChange: (hexcode: string) => void;
    initialColor?: string;
}) => {
    const theme = useTheme();
    const [value, setValue] = React.useState<string>(
        initialColor ?? theme.palette.primary.main
    );

    useEffect(() => {
        setValue(initialColor ?? theme.palette.primary.main);
    }, [initialColor, theme.palette.primary.main]);

    const handleColorChange = (newValue: string) => {
        onChange(newValue);
        setValue(newValue);
    };

    return <MuiColorInput value={value} onChange={handleColorChange} />;
};

export default ColorPicker;

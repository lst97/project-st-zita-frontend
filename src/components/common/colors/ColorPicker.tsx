import React, { useEffect } from 'react';
import { MuiColorInput, MuiColorInputColors } from 'mui-color-input';
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

    const handleColorChange = (
        _newValue: string,
        colors: MuiColorInputColors
    ) => {
        onChange(colors.hex);
        setValue(colors.hex);
    };

    return (
        <MuiColorInput
            format="hex"
            value={value}
            onChange={handleColorChange}
        />
    );
};

export default ColorPicker;

import Dialog from '@mui/material/Dialog';
import { DialogType } from '../../../enums/dialog_enum';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

interface CommonDialogProps {
    type: DialogType;
    title?: string; // Title is optional
    content: React.ReactNode;
}

export const CommonDialog: React.FC<CommonDialogProps> = ({
    type,
    title,
    content
}) => {
    // Logic to determine the color or style based on the dialog type
    let dialogStyle = {};
    switch (type) {
        case DialogType.Info:
            dialogStyle = {
                /* ... */
            };
            break;
        case DialogType.Warning:
            dialogStyle = {
                /* ... */
            };
            break;
        case DialogType.Error:
            dialogStyle = {
                /* ... */
            };
            break;
        default:
            break;
    }

    return (
        <Dialog
            open={true}
            onClose={() => {
                /* Handle Close */
            }}
        >
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent style={dialogStyle}>{content}</DialogContent>
            {/* Optionally add DialogActions if you need buttons */}
        </Dialog>
    );
};

import React from 'react';
import {
    AppointmentTooltip,
    Appointments
} from '@devexpress/dx-react-scheduler-material-ui';
import { JSX } from 'react/jsx-runtime';
import { IconButton } from '@mui/material';

export const AppointmentContent = (
    props: JSX.IntrinsicAttributes &
        Appointments.AppointmentContentProps & {
            [x: string]: any;
            className?: string | undefined;
            style?: React.CSSProperties | undefined;
        }
) => {
    const { data, style } = props;

    return (
        <Appointments.AppointmentContent
            style={{
                ...style,
                backgroundColor: data.color
            }}
            {...props}
        />
    );
};

export const Appointment = (
    props: JSX.IntrinsicAttributes &
        Appointments.AppointmentProps & {
            [x: string]: any;
            className?: string | undefined;
            style?: React.CSSProperties | undefined;
        }
) => {
    const { data, style } = props;

    return (
        <Appointments.Appointment
            style={{
                ...style,
                backgroundColor: data.color
            }}
            {...props}
        />
    );
};

export const AppointmentHeader = (
    props: JSX.IntrinsicAttributes &
        AppointmentTooltip.HeaderProps & {
            [x: string]: any;
            className?: string | undefined;
            style?: React.CSSProperties | undefined;
        },
    onDelete: () => void
) => {
    return (
        <AppointmentTooltip.Header {...props}>
            <IconButton
                onClick={() => {
                    console.log('AppointmentTooltip.Header - TODO');
                }}
            >
                {' '}
                TODO-DELETE
            </IconButton>
        </AppointmentTooltip.Header>
    );
};

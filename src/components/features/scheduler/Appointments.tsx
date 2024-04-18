import React from 'react';
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import { JSX } from 'react/jsx-runtime';

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
                backgroundColor: data.color,
                opacity: data.opacity
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
                backgroundColor: data.color,
                opacity: data.opacity
            }}
            {...props}
            toggleVisibility={false}
        />
    );
};

import { useEffect, useState } from 'react';
import ScheduleViewer from '../../components/features/scheduler/ScheduleViewer';
import Dashboard from '../../components/main/Dashboard';
import { StaffScheduleMap } from '../../models/scheduler/ScheduleModel';
import { fetchAppointmentWeekViewData } from '../../components/features/scheduler/Scheduler';
import Grid from '@mui/material/Unstable_Grid2';
import StaffCard from '../../components/common/cards/Cards';
import StaffCardContent from '../../models/scheduler/StaffCardContent';
import {
    calculateDateGroupTotalHours,
    groupContinuesTime
} from '../../utils/SchedulerHelpers';
import { useNavigate } from 'react-router-dom';
import { InvalidAppointmentShareLinkId } from '../../models/errors/ApiErrors';

const SharedSchedulePage = () => {
    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStaff, setSelectedStaff] = useState<string | null>();
    const navigate = useNavigate();

    const onCurrentDateChange = (date: Date) => {
        setCurrentDate(date);
    };

    // When user change the week view, fetch the new schedule data
    useEffect(() => {
        fetchAppointmentWeekViewData({
            linkId: window.location.pathname.split('/').pop()!,
            currentDate: currentDate,
            onUpdate: setSelectedScheduleMap
        }).catch((error) => {
            if (error instanceof InvalidAppointmentShareLinkId) {
                navigate('/signin');
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const handleStaffCardClick = (name: string) => {
        if (selectedStaff === name) {
            setSelectedStaff(null);
        } else {
            setSelectedStaff(name);
        }
    };

    return (
        <Dashboard>
            <Grid container spacing={2}>
                <Grid xs={4}>
                    {Object.keys(selectedScheduleMap).map((staffName) => {
                        const scheduleValue = selectedScheduleMap[staffName];

                        let dates = scheduleValue.schedule.map(
                            (date) => new Date(date)
                        );

                        let totalHours = calculateDateGroupTotalHours(
                            groupContinuesTime(dates)
                        );

                        return scheduleValue.schedule.length > 0 ? (
                            <StaffCard
                                key={`staff-card-${staffName}`}
                                data={
                                    new StaffCardContent({
                                        name: staffName,
                                        totalHours: totalHours
                                    })
                                }
                                onClick={() => handleStaffCardClick(staffName)}
                                isSelected={selectedStaff === staffName}
                            />
                        ) : null; // If no matching staff data is found, render nothing
                    })}
                </Grid>
                <Grid xs={8}>
                    <ScheduleViewer
                        data={selectedScheduleMap}
                        currentDate={currentDate}
                        onCurrentDateChange={onCurrentDateChange}
                        currentViewName={'Week'}
                        onDelete={() => {}}
                    />
                </Grid>
            </Grid>
        </Dashboard>
    );
};

export default SharedSchedulePage;

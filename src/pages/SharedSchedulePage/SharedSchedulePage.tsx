import { useState } from 'react';
import ScheduleViewer from '../../components/features/scheduler/ScheduleViewer';
import Dashboard from '../../components/main/Dashboard';
import { StaffScheduleMap } from '../../models/scheduler/ScheduleModel';

const SharedSchedulePage = () => {
    const [selectedScheduleMap, setSelectedScheduleMap] =
        useState<StaffScheduleMap>({});

    return (
        <Dashboard>
            <ScheduleViewer
                data={selectedScheduleMap}
                currentDate={new Date()}
                currentViewName={'Week'}
                onDelete={() => {}}
            />
        </Dashboard>
    );
};

export default SharedSchedulePage;

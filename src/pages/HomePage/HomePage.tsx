import StaffScheduler from '../../components/features/scheduler/Scheduler';
import Dashboard from '../../components/main/Dashboard';

const HomePage = () => {
    return (
        <div>
            <Dashboard>
                <StaffScheduler />
            </Dashboard>
        </div>
    );
};

export default HomePage;

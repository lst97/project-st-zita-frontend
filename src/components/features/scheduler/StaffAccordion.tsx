import React, { useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

const StaffAccordion = ({
    title,
    totalCount,
    children
}: {
    title: string;
    totalCount?: number;
    children: React.ReactNode;
}) => {
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        setExpanded(
            totalCount
                ? React.Children.count(children) > 0
                    ? true
                    : false
                : false
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    const handleChange = (
        _event: React.SyntheticEvent<Element, Event>,
        expanded: boolean
    ) => {
        setExpanded(expanded);
    };

    return (
        <Accordion expanded={expanded} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
            >
                <Grid
                    xs={12}
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                >
                    <Typography>{title}</Typography>

                    {totalCount && (
                        <Typography>
                            {React.Children.count(children)} / {totalCount}
                        </Typography>
                    )}
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {children}
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default StaffAccordion;

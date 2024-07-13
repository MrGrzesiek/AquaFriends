import React, {useEffect, useState} from "react";
import {Tab, Tabs, TextField, Alert} from "@mui/material";
import {dismiss_event, getAquariumEvents, getAquariumWarnings} from "../../../components/ApiConnector";
import Button from "@mui/material/Button";

function samePageLinkNavigation(event) {
    if (
        event.defaultPrevented ||
        event.button !== 0 || // ignore everything but left-click
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                // Routing libraries handle this, you can remove the onClick handle when using them.
                if (samePageLinkNavigation(event)) {
                    event.preventDefault();
                }
            }}
            aria-current={props.selected && 'page'}
            {...props}
        />
    );
}

function WarningsWindow({AquariumName}) {
    const [warnings, setWarnings] = useState([]);
    const [showNoWarnings, setShowNoWarnings] = useState(false);

    useEffect(() => {
        let isMounted = true; // track if the component is mounted

        const fetchWarnings = async () => {
            const data = await getAquariumWarnings(AquariumName);
            if (isMounted) {
                setWarnings(data.warnings || []);
            }
        };

        fetchWarnings();

        const timer = setTimeout(() => {
            if (isMounted && warnings.length === 0) {
                setShowNoWarnings(true);
            }
        }, 1000);

        return () => {
            isMounted = false; // cleanup on unmount
            clearTimeout(timer); // clear timeout if component unmounts
        };
    }, [AquariumName, warnings.length]);

    const renderWarnings = (warnings) => {
        if (warnings.length === 0 && showNoWarnings) {
            return <Alert className="warning-alert" severity="success" sx={{ padding: '10px', margin: '10px', gap: '10px'}}>Brak ostrzeżeń</Alert>;
        } else {
            return warnings.map((warning, index) => (
                <Alert className="warning-alert" key={index} severity="warning" sx={{ padding: '10px', margin: '10px 0', width: '100%', boxSizing: 'border-box' }}>{warning.warning_description}</Alert>
            ));
        }
    }

    return (
        <div>
            <h3>Ostrzeżenia dla {AquariumName}:</h3>
            {renderWarnings(warnings)}
        </div>
    );
}


function EventsWindow({ AquariumName }) {
    const [events, setEvents] = useState([]);
    const [showNoEvents, setShowNoEvents] = useState(false);

    useEffect(() => {
        let isMounted = true; // track if the component is mounted

        const fetchEvents = async () => {
            const data = await getAquariumEvents(AquariumName);
            console.log(data)
            if (isMounted && data.events !== undefined) {
                setEvents(data.events.filter(event => event.active) || []);
            }
        };

        fetchEvents();

        const timer = setTimeout(() => {
            if (isMounted && events.length === 0) {
                setShowNoEvents(true);
            }
        }, 1000);

        return () => {
            isMounted = false; // cleanup on unmount
            clearTimeout(timer); // clear timeout if component unmounts
        };
    }, [AquariumName, events.length]);

    const handleIgnoreEvent = async (index) => {
        // get event id
        const eventId = events[index]._id;
        //console.log("Ignoring event with id:", eventId);
        await dismiss_event(eventId);
        // remove event from the list
        setEvents(events.filter((event, i) => i !== index));

    }

    const renderEvents = (events) => {
        console.log(events);

        /* Filter out inactive events */
        const activeEvents = events.filter(event => event.active);

        if (activeEvents.length === 0 && showNoEvents) {
            return <Alert className="event-alert" severity="success">Brak zdarzeń</Alert>;
        } else {
            return activeEvents.map((event, index) => (
                <Alert
                    className="event-alert"
                    key={index}
                    action={
                        <Button
                            className="event-dismiss"
                            color="inherit"
                            size="small"
                            onClick={() => handleIgnoreEvent(index)}
                        >
                            Nie pokazuj
                        </Button>
                    }
                    severity="info"
                >
                    <div className="event-desc"><b>{event.event_type}</b></div>
                    <div className="event-desc">{event.event_description}</div>
                    <div className="event-desc">({event.event_time})</div>
                </Alert>
            ));
        }
    };

    return (
        <div className="events-container">
            <h3>Zdarzenia dla {AquariumName}:</h3>
            <div className="alerts-container">
                {renderEvents(events)}
            </div>
        </div>
    );
}


function WarningsAndEvents({AquariumName}) {
    const [eventsActive, setEventsActive] = React.useState(false);
    const [warningsActive, setWarningsActive] = React.useState(true);
    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
            event.type !== 'click' ||
            (event.type === 'click' && samePageLinkNavigation(event))
        ) {
            setValue(newValue);
        }

        // if there was a change set eventsActive and warningsActive to according values
        if (newValue === 0) {
            setWarningsActive(true);
            setEventsActive(false);
        } else if (newValue === 1) {
            setWarningsActive(false);
            setEventsActive(true);
        }

    };

    return (
    <div className="aquamonitor-warnings-and-events">
        <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="nav tabs example"
            role="navigation"
        >
            <LinkTab className="tabButton" label="Ostrzeżenia"/>
            <LinkTab className="tabButton" label="Zdarzenia"/>
        </Tabs>
        <div className="tabContent">
            {warningsActive === true && <WarningsWindow AquariumName={AquariumName}/>}
            {eventsActive === true && <EventsWindow AquariumName={AquariumName} />}
        </div>
    </div>
    );
}

export default WarningsAndEvents;
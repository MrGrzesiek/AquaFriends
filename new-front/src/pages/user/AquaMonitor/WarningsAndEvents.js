import React, {useEffect, useState} from "react";
import {Tab, Tabs, TextField, Alert} from "@mui/material";
import {getAquariumWarnings} from "../../../components/ApiConnector";

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

    useEffect(() => {
        let isMounted = true; // track if the component is mounted
        getAquariumWarnings(AquariumName).then((data) => {
            if (isMounted) {
                setWarnings(data.warnings || []);
            }
        });
        return () => {
            isMounted = false; // cleanup on unmount
        };
    }, [AquariumName]);

    const renderWarnings = (warnings) => {
        if (warnings.length === 0) {
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


function WarningsAndEvents({AquariumName}) {
    const [eventsActive, setEventsActive] = React.useState(false);
    const [warningsActive, setWarningsActive] = React.useState(false);
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
            {eventsActive === true && <TextField id="outlined-basic" label="Zdarzenia" variant="outlined" />}
        </div>
    </div>
    );
}

export default WarningsAndEvents;
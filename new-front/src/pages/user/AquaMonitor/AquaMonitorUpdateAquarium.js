import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import '../../../CSS/AquaMonitorDetails.css';
import {MenuItem, Select} from "@mui/material";
import {uploadNewEvent} from "../../../components/ApiConnector";


function EventsModal({ open, handleClose, aquariumName  }) {
    const [eventType, setEventType] = React.useState('');
    const [descriptionBoxVisible, setDescriptionBoxVisible] = React.useState(false);

    React.useEffect(() => {
        // Reset state when modal is closed
        if (!open) {
            setEventType('');
            setDescriptionBoxVisible(false);
        }
    }, [open]);


    const handleEventSelection = (event) => {
        setEventType(event.target.value);
        setDescriptionBoxVisible(true);
    };

    const handleNewEvent = () => {
        console.log("New event: ", eventType);
        console.log("Description: ", document.querySelector('.description-box').value);
        console.log("Aquarium name: ", aquariumName)
        //export const uploadNewEvent = async (aquariumName, eventType, eventDescription) => {
        uploadNewEvent(aquariumName, eventType, document.querySelector('.description-box').value);
        handleClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-box events-box">
                <button className="close-button" onClick={handleClose}>&times;</button>
                <h2 id="child-modal-title">Wybierz rodzaj zdarzenia</h2>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={eventType}
                    onChange={handleEventSelection}
                    autoWidth
                    label="Age"
                >
                    <MenuItem value={'Pojawienie się glonów'}>Pojawienie się glonów</MenuItem>
                    <MenuItem value={'Pojawienie się ślimaków'}>Pojawienie się ślimaków</MenuItem>
                    <MenuItem value={'Śmierć ryby'}>Śmierć ryby</MenuItem>
                </Select>
                {descriptionBoxVisible && <textarea className="description-box" placeholder="Opis zdarzenia"/>}
                <Button className="modal-button" onClick={handleNewEvent}>Zapisz</Button>
            </Box>
        </Modal>
    );
}

function ParametersModal({ open, handleClose }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box className="modal-box child-modal-box">
                <button className="close-button" onClick={handleClose}>&times;</button>
                <h2 id="child-modal-title">Podaj parametry akwarium:</h2>
                <p id="child-modal-description">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </p>
            </Box>
        </Modal>
    );
}

export default function AquariumUpdateChoiceMenu({ open, onClose, aquariumName  }) {
    const [eventBoxOpen, setEventBoxOpen] = React.useState(false);
    const[parametersBoxOpen, setParametersBoxOpen] = React.useState(false);

    const handleEventBoxOpen = () => {
        setEventBoxOpen(true);
    };

    const handleEventBoxClose = () => {
        setEventBoxOpen(false);
    };

    const handleParametersBoxOpen = () => {
        setParametersBoxOpen(true);
    }

    const handleParametersBoxClose = () => {
        setParametersBoxOpen(false);
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box className="modal-box">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2 id="parent-modal-title">Wybierz akcję:</h2>
                <p id="parent-modal-description"></p>
                <Button className="modal-button" onClick={handleEventBoxOpen}>Nowe wydarzenie</Button>
                <Button className="modal-button" onClick={handleParametersBoxOpen}>Zaktualizuj parametry akwarium</Button>
                <EventsModal open={eventBoxOpen} handleClose={handleEventBoxClose} aquariumName={aquariumName}/>
                <ParametersModal className="parameters-box" open={parametersBoxOpen} handleClose={handleParametersBoxClose }/>
            </Box>
        </Modal>
    );
}

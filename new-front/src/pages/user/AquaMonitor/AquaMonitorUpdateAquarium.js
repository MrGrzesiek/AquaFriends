import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import '../../../CSS/AquaMonitorDetails.css';
import {Alert, MenuItem, Select, Slider, Stack, TextField} from "@mui/material";
import {updateAquariumData, uploadNewEvent} from "../../../components/ApiConnector";
import {useEffect} from "react";
import {ghMarks, khMarks, no2Marks, no3Marks, phMarks, tempMarks} from "./ValuesBrackets";


function EventsModal({ open, handleClose, aquariumName  }) {
    const [eventType, setEventType] = React.useState('');
    const [descriptionBoxVisible, setDescriptionBoxVisible] = React.useState(false);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('error');

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


    const handleNewEvent = async () => {
        console.log("New event: ", eventType);
        console.log("Description: ", document.querySelector('.description-box').value);
        console.log("Aquarium name: ", aquariumName)
        //export const uploadNewEvent = async (aquariumName, eventType, eventDescription) => {
        const response = await uploadNewEvent(aquariumName, eventType, document.querySelector('.description-box').value);
        console.log("Response: ", response)
        console.log("Response code: ", response.code)
        if (response.code != 200 || isNaN(response.code)) {
            console.log("Dupaaaaaaaaaaaaaaaaaaaa ", response.code)
            setAlertVisible(true);
            setAlertMessage("Nie udało się zaktualizować danych akwarium");
            setAlertSeverity("error");
        } else {
            console.log("Humor gituwa")
            setAlertVisible(true);
            setAlertMessage("Dane akwarium zostały zaktualizowane");
            setAlertSeverity("success");
        }
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
                {alertVisible && (
                    <Alert severity={alertSeverity} onClose={() => setAlertVisible(false)}>
                        {alertMessage}
                    </Alert>
                )}
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

function ParametersModal({ open, handleClose, AquariumData }) {
    const [temperature, setTemperature] = React.useState(AquariumData.temperature);
    const [ph, setPh] = React.useState(AquariumData.ph);
    const [No2, setNo2] = React.useState(AquariumData.No2);
    const [No3, setNo3] = React.useState(AquariumData.No3);
    const [GH, setGH] = React.useState(AquariumData.GH);
    const [KH, setKH] = React.useState(AquariumData.KH);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('error');

    const handleTemperatureChange = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value >= 1 && value <= 99){
            setTemperature(newValue);
        }
    }

    const handlePhChange = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value > 2 && value < 8) {
            setPh(newValue);
        }
    }

    const handleNo2Change = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value >= 0 && value <= 5) {
            setNo2(newValue);
        }
    }

    const handleNo3Change = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value >= 0 && value <= 100) {
            //setNo3(calculateNo3(event, newValue));
            setNo3(newValue)
        }
    }

    const handleGHChange = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value >= 0 && value <= 100) {
            setGH(newValue);
        }
    }

    const handleKHChange = (event, newValue) => {
        const value = newValue;
        if (!isNaN(newValue) && value >= 0 && value <= 100) {
            setKH(newValue);
        }
    }

    const calculateNo3 = (event, newValue) => {
        const lowValuesCalculation = (x) => {
            return (2/3) * x;
        }
        const highValuesCalculation = (x) => {
            //console.log("High values calculation: ", Math.pow((12 / (0.04 * x)), (x / 6)) / 450000)
            return Math.pow((12 / (0.04 * x)), (x / 6)) / 450000;
        }
        console.log("New value: ", newValue)
        if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
            if (lowValuesCalculation(newValue) > highValuesCalculation(newValue)) {
                return lowValuesCalculation(newValue);
            } else {
                return highValuesCalculation(newValue);
            }
        }
        return 0;
    }

    const handleSave = () => {
        AquariumData.temperature = temperature;
        AquariumData.ph = ph;
        AquariumData.No2 = No2;
        AquariumData.No3 = No3;
        AquariumData.GH = GH;
        AquariumData.KH = KH;

        console.log("All data: ", AquariumData)
        try {
            const response = updateAquariumData (AquariumData);
            console.log("Response: ", response)
            if (!response.code === 200) {
                setAlertVisible(true);
                setAlertMessage("Nie udało się zaktualizować danych akwarium");
                setAlertSeverity("error");
            } else {
                setAlertVisible(true);
                setAlertMessage("Dane akwarium zostały zaktualizowane");
                setAlertSeverity("success");
            }
        }
        catch (error) {
            console.error("Error updating aquarium data:", error);
            throw error;
        }

    }

    useEffect(() => {
        setTemperature(AquariumData.temperature);
        setPh(AquariumData.ph);
        setNo2(AquariumData.No2);
        setNo3(AquariumData.No3);
        setGH(AquariumData.GH);
        setKH(AquariumData.KH);
    }, [AquariumData]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
            className = "child-modal-box"
        >
            <Box className="child-modal-box all-parameters-box">
                <button className="close-button" onClick={handleClose}>&times;</button>
                <h2 id="child-modal-title">Podaj parametry akwarium:</h2>
                <p id="child-modal-description"></p>
                {alertVisible && (
                    <Alert severity={alertSeverity} onClose={() => setAlertVisible(false)}>
                        {alertMessage}
                    </Alert>
                )}
                <h4>Temperatura [°C]</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="Temperature" valueLabelDisplay="on" marks={tempMarks} step={0.5} min={10} max={60} value={temperature} onChange={handleTemperatureChange} />
                    </Stack>
                </Box>
                <h4>ph</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="PH" valueLabelDisplay="on" marks={phMarks} step={0.1} min={2.1} max={7.9} value={ph} onChange={handlePhChange} />
                    </Stack>
                </Box>
                <h4>NO2 [mg/l]</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="NO2" valueLabelDisplay="on" marks={no2Marks} step={0.1} min={0} max={5} value={No2} onChange={handleNo2Change} />
                    </Stack>
                </Box>
                <h4>NO3 [ppm]</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="NO3" valueLabelDisplay="on" marks={no3Marks} step={0.1} min={0} max={100} value={No3} onChange={handleNo3Change} />
                    </Stack>
                </Box>
                <h4>GH [°dGH]</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="GH" valueLabelDisplay="on" marks={ghMarks} step={0.1} min={0} max={10} value={GH} onChange={handleGHChange} />
                    </Stack>
                </Box>
                <h4>KH [°dKH]</h4>
                <Box className="parameter-box">
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Slider aria-label="KH" valueLabelDisplay="on" marks={khMarks} step={0.1} min={0} max={10} value={KH} onChange={handleKHChange} />
                    </Stack>
                </Box>
                <Button className="child-modal-box all-parameters-box properties-save-button" onClick={handleSave}>Zapisz</Button>
            </Box>
        </Modal>
    );
}

export default function AquariumUpdateChoiceMenu({ open, onClose, aquariumName, aquariumData }) {
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
                <ParametersModal className="parameters-box" open={parametersBoxOpen} handleClose={handleParametersBoxClose} AquariumData={aquariumData} />
            </Box>
        </Modal>
    );
}

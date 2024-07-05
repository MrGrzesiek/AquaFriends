import {Route, Routes, useParams} from "react-router-dom";
import React, {useState} from "react";
import {fetchUser, updateEmail} from "../../../components/ApiConnector";
import {Alert, CircularProgress, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import './../../../CSS/styles.css'
import "./../../../CSS/DataForm.css";

const AquaAccountDetails = () => {
    const { username } = useParams();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('error');

    const fetchUserData = async () => {
        console.log("Fetching user data for user: ", username);
        try {
            const response = await fetchUser(username); // Pass username to fetchUser if needed
            if (response) {
                console.log(response.email);
                setEmail(response.email);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const handleSave = async () => {
        // get email value from TextField
        const newEmail = document.getElementById("email-text-field").value;
        const response = await updateEmail(newEmail);

        if (!response) {
            setAlertVisible(true);
            setAlertMessage("Błąd (null response) podczas aktualizacji adresu email");
            setAlertSeverity("error");
            return;
        }

        if (response.code !== 200 || isNaN(response.code)) {
            setAlertVisible(true);
            if(response.code === 418) {
                setAlertMessage("Adres email musi różnić się od poprzedniego");
            } else {
                setAlertMessage("Błąd podczas aktualizacji adresu email");
            }
            setAlertSeverity("error");
        } else {
            setAlertVisible(true);
            setAlertMessage("Email został zaktualizowany");
            setAlertSeverity("success");
        }
    }

    React.useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading) {
        return <CircularProgress />; // Display a loading indicator while fetching data
    } else {
        return (
            <div className="AquaAccount">
                <h1>AquaAccount</h1>
                <h2>Cześć {username}</h2>
                {alertVisible && (
                    <Alert severity={alertSeverity} onClose={() => setAlertVisible(false)}>
                        {alertMessage}
                    </Alert>
                )}
                <div className="data-form">
                <h3>Wprowadź nowy adres email</h3>
                <div className="form-group">
                <label htmlFor="email-text-field">Adres email</label>
                <input className="form-group" id="email-text-field" label="Email" variant="outlined" defaultValue={email}/>
                <Button className="submit-button" variant="contained" color="primary" onClick={handleSave}>Zapisz</Button>
                </div>
                </div>
            </div>
        );
    }

}

const AquaAccount = () => {
    return (
        <div>
            <div>
                <Routes>
                    <Route path="/:username" element={<AquaAccountDetails/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default AquaAccount;
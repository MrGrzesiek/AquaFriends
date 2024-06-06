import React from "react";
import CryptoJS from 'crypto-js';

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = React.useState({});

  const handleChange = evt => {
    const { name, value } = evt.target;
    setState({
      ...state,
      [name]: value
    });
    // Czyścimy błąd, gdy użytkownik zaczyna wpisywać w danym polu
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { name, email, password } = state;

    // Prosta walidacja, sprawdzająca, czy pola nie są puste
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Pole nazwa jest wymagane";
    }
    if (!email.trim()) {
      newErrors.email = "Pole email jest wymagane";
    }
    if (!password.trim()) {
      newErrors.password = "Pole hasło jest wymagane";
    }

    // Jeśli są jakiekolwiek błędy, ustawiamy je w state errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Proszę wypełnić wszystkie pola formularza.");
      return;
    }

    try {
      // Wykonaj żądanie rejestracji
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const registerResponse = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: name,
          password_hash: hashedPassword,
          email: email
        })
      });
      const registerData = await registerResponse.json();
      console.log('Register response:', registerData);

      // Jeśli rejestracja przebiegła pomyślnie, możesz wykonać odpowiednie akcje, np. przekierowanie użytkownika do innej strony
    } catch (error) {
      console.error('Error during registration:', error);
      // Obsłużanie błędów rejestracji
    }

    // Czyszczenie stanu formularza po wysłaniu
    setState({
      name: "",
      email: "",
      password: ""
    });
    alert("Konto utworzone pomyślnie.");
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Utwórz konto</h1>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Nazwa"
          style={{ border: errors.name ? "2px solid red" : "" }}
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          style={{ border: errors.email ? "2px solid red" : "" }}
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Hasło"
          style={{ border: errors.password ? "2px solid red" : "" }}
        />
        <button>Rejestracja</button>
      </form>
    </div>
  );
}

export default SignUpForm;

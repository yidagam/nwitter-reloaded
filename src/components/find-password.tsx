import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';


export default function FindPassword(){

	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	
	const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const {target:{name, value}} = e;
		if(name === "email"){
			setEmail(value);
		}
	};

	const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		if(isLoading || email==="") return;
		try {
			setLoading(true);
			await sendPasswordResetEmail(auth, email);
			alert("Email Sent. Haven't received it, check spam folder.");
			navigate("/login");
		} catch (e) {
			if(e instanceof FirebaseError){
				console.log(e.message);
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}


		console.log(name, email);
	};


	return (
		<Wrapper>
			<Title>Find Password</Title>
			<Form onSubmit={onSubmit}>
				<Input
					onChange={onChange} 
					value={email} 
					name="email" 
					placeholder="email" 
					type="email" 
					required
				/>
				<Input 
					type="submit" 
					value={isLoading ? "Loading" : "Send Email"}
				/>
			</Form>
			{error != "" ? <Error>{error}</Error> : null}
			<Switcher>
				Don't have an account?{" "}
				<Link to="/create-account">Create One &rarr;</Link>
			</Switcher>
		</Wrapper>
	);

}
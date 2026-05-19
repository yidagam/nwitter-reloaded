import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth/cordova";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, Switcher, Title, Wrapper } from '../components/auth-components';
import GithubButton from '../components/github-btn';


export default function CreateAccount(){
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	
	const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		const {target:{name, value}} = e;
		if(name === "name"){
			setName(value);
		} else if(name === "email"){
			setEmail(value);
		} else if(name === "password"){
			setPassword(value);
		} 
	};

	const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		if(isLoading || name==="" || email==="" || password==="") return;
		try {
			setLoading(true);
			const credentials = await createUserWithEmailAndPassword(auth, email, password);
			console.log(credentials.user);
			await updateProfile(credentials.user, {
				displayName: name,
			});
			navigate("/");
		} catch (e) {
			if(e instanceof FirebaseError){
				console.log(e.message);
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}


		console.log(name, email, password);
	};


	return (
		<Wrapper>
			<Title>Join Twitter</Title>
			<Form onSubmit={onSubmit}>
				<Input
					onChange={onChange} 
					value={name} 
					name="name" 
					placeholder="name" 
					type="text" 
					required
				/>
				<Input
					onChange={onChange} 
					value={email} 
					name="email" 
					placeholder="email" 
					type="email" 
					required
				/>
				<Input
					onChange={onChange} 
					value={password} 
					name="password" 
					placeholder="password" 
					type="password" 
					required
				/>
				<Input 
					type="submit" 
					value={isLoading ? "Loading" : "Create Account"}
				/>
			</Form>
			{error != "" ? <Error>{error}</Error> : null}
			<Switcher>
				Don't remember your password?{" "}
				<Link to="/find-password">Send email &rarr;</Link>
			</Switcher>
			<Switcher>
				Already have an account?{" "}
				<Link to="/login">Log In &rarr;</Link>
			</Switcher>
			<GithubButton />
		</Wrapper>
	);

}
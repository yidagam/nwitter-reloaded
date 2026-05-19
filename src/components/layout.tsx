import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Menu, MenuItem } from "./home-components";
import { auth } from "../firebase";


const Wrapper = styled.div` //globalStyle
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
::-webkit-scrollbar {
		display:none;
	}

`;

export default function Layout(){
	const navigate = useNavigate();

	const onLogOut = async () => {
		const okConfirm = confirm("Are you sure you want to log out?");
		if(okConfirm){
			await auth.signOut();
			navigate("/login");
		}
	};


	return (
		<Wrapper>
			<Menu>
				<Link to="/">
					<MenuItem>
						<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						  <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
						</svg>					
					</MenuItem>
				</Link>
				<Link to="/profile">
					<MenuItem>
						<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						  <path clipRule="evenodd" fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
						</svg>
					</MenuItem>				
				</Link>
				
				<MenuItem onClick={onLogOut} className="log-out">
					<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					  <path clipRule="evenodd" fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
					</svg>
				</MenuItem>
			</Menu>
			<Outlet />  {/* app에서 선언한 children 배열로 내려감 */}
		</Wrapper>
	);

}


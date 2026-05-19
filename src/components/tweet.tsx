import styled from "styled-components";
import type { ITweet } from "./timeline";
import { auth, database } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const UserID = styled.span`
  font-weight: 600;
  margin-left: 20px;
  font-size: 15px;
  opacity: 0.8;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 2px 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: lightgray;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 2px 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin: 15px 5px 0px 0px;
`;

export default function Tweet({tweet, userId, username, fileData, id}:ITweet){

	const user = auth.currentUser;
	const onDelete = async() => {
		if(user?.uid !== userId) return;
		try{
			const okConfirm = confirm("Are you sure delete Tweet?");
			if(okConfirm){
				await deleteDoc(doc(database, "tweets", id));
			}
		} catch(e) {
			console.log(e);
		} finally {}
	};

	const onEdit = async() => {
		if(user?.uid !== userId) return;
		try{
			let newTweet = ""
			let promptText = prompt("Enter [Tweet] you want to change"+"");
			if(promptText != null){
				newTweet = promptText;
				await updateDoc(doc(database, "tweets", id), {tweet:newTweet});				
			}
		} catch(e) {
			console.log(e);
		} finally {}
	};

	return <Wrapper>
		<Column>
		<Username>{username}</Username>
		<UserID>@{userId}</UserID>
		<Payload>{tweet}</Payload>
		{user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton>:null}
		{user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton>:null}
		</Column>

		{fileData ? 
			<Column>
			<Photo src={fileData} />
			</Column> : null
		}

	</Wrapper>
}
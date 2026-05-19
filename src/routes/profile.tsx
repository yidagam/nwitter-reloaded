import styled from "styled-components";
import { auth, database } from "../firebase";
import { useEffect, useState } from "react";
import { handleFileChange } from "../components/postTweet-form";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";


const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const EditButton = styled.button`
  background-color: transparent;
  color: lightgray;
  font-weight: 600;
  font-size: 12px;
  padding: 2px 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin: 15px 5px 0px 0px;
  &:hover {
    color: white;
  }
`;
const Annote = styled.span`
  font-size: 12px;
  color: white;
  opacity: 50%;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Anonymous = () => (<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <path clipRule="evenodd" fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /> </svg>);

export default function Profile(){
	const user = auth.currentUser;
	const [avatar, setAvatar] = useState<string>(user?.photoURL||"");
	const [name, setName] = useState<string>(user?.displayName||"Anonymous");
	const [tweets, setTweet] = useState<ITweet[]>([]);


	const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	      handleFileChange(e, async (fileData) => {
	          setAvatar(fileData);
		      await updateProfile(user!, {
		        photoURL: fileData,
		      });
	      });
	  };

	 const onChangeName = async() => {
		try{
			let newName = ""
			let promptText = prompt("Enter [Name] you want to change"+"");
			if (promptText=="" || promptText == null) {
				setName("Anonymous");
			} else if(promptText != null){
				newName = promptText;
				await updateProfile(user!, {
		        displayName: newName,
		      });
		      setName(newName);			
			}
		} catch(e) {
			console.log(e);
		} finally {}
	};

	const fetchTweets = async() => {
		const tweetQuery = query(
			collection(database, "tweets"),
			where("userId", "==", user?.uid),
			orderBy("createdAt", "desc"),
			limit(25)
		);
		const snapshot = await getDocs(tweetQuery);
		const tweets = snapshot.docs.map((doc) => {
			const {tweet, createdAt, userId, username, fileData} = doc.data();
			return {tweet, createdAt, userId, username, fileData, id:doc.id};
		});
		setTweet(tweets);
	};

	useEffect( () => {
		fetchTweets();
	}, []);

	return (
		<Wrapper>
			<AvatarUpload htmlFor="avatar">
				{Boolean(avatar) ? <AvatarImg src={avatar} /> : <Anonymous /> }
			</AvatarUpload>
			<AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
			<Name>
				{name}
				&nbsp;
				<EditButton onClick={onChangeName}>Edit</EditButton>
			</Name>
			<Annote>Changes won't be applied retroactively.</Annote>
		<hr style={{width:"75%", margin:"20px 0px"}} />
			<Tweets>
				{tweets.map((tweet) => (
	        		<Tweet key={tweet.id} {...tweet} />
	      		))}
			</Tweets>
		</Wrapper>
	);

}
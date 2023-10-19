import { Card, Grid, Spacer, Description, Image, Button } from '@geist-ui/core';
import { useEffect, useState } from 'react';
import { Modal } from '@geist-ui/core';
import { getUsers } from '../api/callbacks';

interface User {
	name: string;
	username: string;
	phoneNo: string;
	avatarURL: string;
	designation: string;
	lastLoginAt: number;
	channels?: any;
}
interface Params {
	setIsAuthenticated: (value: React.SetStateAction<boolean>) => void
}

const People: React.FC<Params> = ({ setIsAuthenticated }) => {
	const [people, setPeople] = useState<User[]>([
		{ name: "Md Rahbar", username: "rahbar", avatarURL: "https://avatars.githubusercontent.com/u/75195728?v=4", phoneNo: "8445979949", designation: "OWNER", lastLoginAt: 1326474879 },
		{ name: "Aditya", username: "bangar", avatarURL: "https://avatars.githubusercontent.com/u/16359086?v=4", phoneNo: "1234567890", designation: "NON GBM", lastLoginAt: 485875689 },
	]);

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [channel, setChannel] = useState<User>({ name: "", username: "", avatarURL: "", phoneNo: "", designation: "", lastLoginAt: 0 });

	const closeModal = () => { setModalIsOpen(false) }

	const userModal = (channel: User) => {
		setChannel(channel);
		setModalIsOpen(true);
	}

	const logoutClick = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("username");
		setIsAuthenticated(false);
	}

	useEffect(() => {
		getUsers().then((res) => {
			if (res.Status === 200) {
				setPeople(res.Payload)
			} else {
				alert("Fetching people failed with error code: " + res.Status);
			}
		}).catch((err) => {
			alert(err || err?.message || "Something went wrong!");
		})
	}, [])

	return (<>
		<Card width="100%">
			<Description title={"List of people registered with Channel"} content={<b>People using Channel</b>} />
		</Card>
		<Spacer />
		<Modal
			visible={modalIsOpen}
			onClose={closeModal}
			style={{ alignContent: "flex-start", alignItems: "flex-start" }}
		>
			<Modal.Title>
				User view
			</Modal.Title>
			<div style={{ alignContent: "flex-start", alignItems: "flex-start", textAlign: "start" }}>
				<Image src={channel.avatarURL}></Image>
				<Description title={"User Name"} content={<b>{channel?.name}</b>} /> <Spacer />
				<Description title={"Username"} content={<b>{channel?.username}</b>} /><Spacer />
				<Description title={"Phone No"} content={<b>{channel?.phoneNo}</b>} /><Spacer />
				<Description title={"Channel Designation"} content={<b>{channel.designation}</b>} /> <Spacer />
				<Description title={"Last Login"} content={<b>{(new Date(channel.lastLoginAt * 1000)).toDateString()}</b>} />
			</div>

			<Modal.Action onClick={closeModal}>
				Close
			</Modal.Action>

		</Modal>
		<Card width="100%">
			<Grid.Container gap={2}>
				{people.map((person) => {
					return (
						<Grid lg={8} justify="center" key={person.username}>
							<Card className="col" style={{ cursor: "pointer" }} onClick={() => { userModal(person) }}>
								<Image src={person.avatarURL}></Image>
								<Description title={person.username} content={<b>{person.name.toUpperCase()}</b>} />
							</Card>
						</Grid>
					);
				})}
			</Grid.Container>
			<Spacer />
			<Button type="error" style={{ width: "100%" }} onClick={() => { logoutClick() }}>
				Log Out
			</Button>
		</Card>
	</>);
}

export default People;

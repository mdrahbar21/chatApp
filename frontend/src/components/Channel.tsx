import { Card, Grid, Spacer, Description, Modal, Text, Button } from '@geist-ui/core';
import { useEffect, useState } from 'react';
import { deleteMembership, getAllChannels, getChannels, postMembership } from '../api/callbacks';


export interface Channel {
	name: string;
	description: string;
	createdAt: number;
	createdByUsername: string;
}

interface Props {
	channels: Channel[]
	setchannels: (value: React.SetStateAction<Channel[]>) => void
	tick: boolean
}

const People: React.FC<Props> = ({ channels, setchannels, tick }) => {

	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [channel, setChannel] = useState<Channel>({ name: "", description: "", createdAt: 0, createdByUsername: "" });
	const [allChannel, setAllChannel] = useState<Channel[]>([{ name: "", description: "", createdAt: 0, createdByUsername: "" }]);

	const closeModal = () => { setModalIsOpen(false) }

	const userModal = (channel: Channel, action: string) => {
		setChannel(channel);
		setModalIsOpen(true);
	}
	useEffect(() => {
		getAllChannels().then((res) => {
			if (res.Status === 200) {
				setAllChannel(res.Payload);
			} else {
				alert("Error in feching all channels " + res.Payload + res.Status);
			}
		}).catch((err) => {
			alert("Error in feching all channels " + err || err?.message || "");
		});
	}, [tick])

	const updateChannels = () => {
		getChannels().then((res) => {
			if (res.Status === 200) {
				setchannels(res.Payload)
			} else {
				alert("Failed with error code: " + res.Status);
			}
		}).catch((err) => {
			alert(err || err?.message || "Something went wrong!");
		})
	}

	const postMembershipp = (id: string) => {
		postMembership(id).then((res) => {
			updateChannels()
		}).catch((err) => {
			alert("post memebership failed with: " + err || err?.message || "")
		})
	}

	const deleteMembershipp = (id: string) => {
		deleteMembership(id).then((res) => {
			updateChannels()
		}).catch((err) => {
			alert("delete memebership failed with: " + err || err?.message || "")
		})
	}

	return (<>
		<Card width="100%">
			<Description title={"List of channels registered"} content={<b>All Channel</b>} />
		</Card>
		<Spacer />
		<Modal
			visible={modalIsOpen}
			onClose={closeModal}
			style={{ alignContent: "flex-start", alignItems: "flex-start" }}
		>
			<Modal.Title>
				Channel view
			</Modal.Title>
			<div style={{ alignContent: "flex-start", alignItems: "flex-start", textAlign: "start" }}>
				<Description title={"Channel Name"} content={<b>{channel?.name}</b>} /> <Spacer />
				<Description title={"Channel Description"} content={<b>{channel?.description}</b>} /><Spacer />
				<Description title={"Channel Created By"} content={<b>{channel?.createdByUsername}</b>} /><Spacer />
				<Description title={"Channel Created At"} content={<b>{new Date(channel.createdAt * 1000).toDateString()}</b>} />
			</div>

			<Modal.Action onClick={closeModal}>
				Close
			</Modal.Action>

		</Modal>
		<Card width="100%">
			<Grid.Container gap={2}>
				<Grid xs={24}>
					<Text h3> Your channels</Text>
				</Grid>
				{channels.map((person) => {
					return (
						<Grid lg={8} justify="center" key={person.name}>
							<Card className="col" width="90%" style={{ cursor: "pointer" }} onClick={() => { userModal(person, 'l') }}>
								<Description title={"Channel Name"} content={<b>{person?.name}</b>} /> <Spacer />
								<Description title={"Channel Description"} content={<b>{person?.description}</b>} />
								<Spacer />
								<Button onClick={() => { deleteMembershipp(person.name) }}>Leave Channel</Button>
							</Card>
						</Grid>
					);
				})}
			</Grid.Container>
			<Grid.Container gap={2}>
				<Grid xs={24}>
					<Text h3> Other channels</Text>
				</Grid>
				{allChannel.map((person) => {
					if (channels.some((channel) => { return channel.name === person.name }))
						return <></>;
					else return (
						<Grid lg={8} justify="center" key={person.name}>
							<Card className="col" width="90%" style={{ cursor: "pointer" }}
								onClick={() => { userModal(person, 'j') }}
							>
								<Description title={"Channel Name"} content={<b>{person?.name}</b>} /> <Spacer />
								<Description title={"Channel Description"} content={<b>{person?.description}</b>} />
								<Spacer />
								<Button onClick={() => { postMembershipp(person.name) }}>Join Channel</Button>
							</Card>
						</Grid>
					);
				})}
			</Grid.Container>
		</Card>
	</>);
}

export default People;

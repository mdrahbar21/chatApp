import { Card, Grid, Text, Spacer, Link, Description, Input, Button, Modal } from '@geist-ui/core';
import { Send, ArrowRight, X, Trash2 } from "@geist-ui/icons";
import React, { useState, useEffect, useRef } from 'react';
import { ChannelParams, getChannels, getMessages, postChannel, deleteChannel as dChannel, postMessage, MessageParams } from '../api/callbacks';
import People from './People';
import Channel from './Channel';

interface Params {
	setIsAuthenticated: (value: React.SetStateAction<boolean>) => void
}

const InsideScreen: React.FC<Params> = ({ setIsAuthenticated }) => {
	const emptychannel = { description: "", name: "", createdAt: 0, createdByUsername: "" }
	const [activeChannel, setActiveChannel] = useState(emptychannel);
	const messageEndRef = useRef<HTMLDivElement>(null);
	const [modalIsOpen, setIsOpen] = React.useState(false);
	const [modalIsOpen1, setModalIsOpen1] = React.useState(false);
	const [tab, setTab] = useState('c');
	const [cname, setCname] = useState("");
	const [descr, setDescr] = useState("");
	const [msg, setMsg] = useState("");
	const [tick, setTick] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	}
	const closeModal1 = () => {
		setModalIsOpen1(false);
	}

	const [channels, setChannels] = useState([
		{ description: "General Conversation", name: "general", createdAt: 1649745585, createdByUsername: "Harshit" },
		{ description: "Water Cooler", name: "water-cooler", createdAt: 1649743900, createdByUsername: "Harshit" },
	]);

	const [messages, setMessages] = useState([
		{
			id: 1,
			content: "hello ppl",
			sentAt: 1650297586,
			sentByUsername: "harshit",
			channelName: "lollll"
		},
		{
			id: 2,
			content: "hello!",
			sentAt: 1680297596,
			sentByUsername: "harshit 2",
			channelName: "lollll"
		},
	]);

	const handleScroll = () => {
		if (messageEndRef.current?.scrollIntoView) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
			setTimeout(() => {
				if (messageEndRef.current?.scrollIntoView)
					messageEndRef.current.scrollIntoView = () => { }
			}, 1000);
		}
	}

	const handleAddChannel = () => {
		setIsOpen(true);
	}

	const deleteChannel = () => {
		dChannel(activeChannel.name);
		setModalIsOpen1(false);
		getChannels().then((res) => {
			if (res.Status === 200) {
				setChannels(res.Payload)
			} else {
				alert("Failed with error code: " + res.Status);
			}
			setTick(!tick);
			setTab('c');
			setActiveChannel(emptychannel)
		}).catch((err) => {
			alert(err || err?.message || "Something went wrong!");
		})
	}

	const sendMessage = () => {
		const params: MessageParams = {
			Content: msg,
			ChannelId: activeChannel.name
		}
		postMessage(params).then((res) => {
			if (res.Status === 200) {
				getMessages(activeChannel.name, 0).then((res) => {
					if (res.Status === 200) {
						setMessages(res.Payload);
					} else {
						alert("Failed with error code: " + res.Status);
					}
				}).catch((err) => {
					alert(err || err?.message || "Something went wrong!");
				})
			} else {
				alert("Failed with error code: " + res.Status);
			}
			setMsg("");
		}).catch((err) => {
			alert(err || err?.message || "Something went wrong!");
		})
	}

	const addChannel = () => {
		const params: ChannelParams = {
			Name: cname,
			Description: descr
		};
		postChannel(params).then(res => {
			if (res.Status === 200) {
				setIsOpen(false);
			} else {
				alert("Failed with error code: " + res.Status);
			}
			setTick(!tick);
			setTab('c');
			setActiveChannel(emptychannel)
		}).catch(err => {
			alert("Error creating channel");
		});
	}

	useEffect(() => {
		getChannels().then((res) => {
			if (res.Status === 200) {
				setChannels(res.Payload)
			} else {
				alert("Failed with error code: " + res.Status);
			}
		}).catch((err) => {
			alert(err || err?.message || "Something went wrong!");
		})
	}, []);

	const updateMessages = async () => {
		let messageLast = 0;
		const mmm = messages
		console.log(messages);
		
		if (mmm.length > 0) {
			messageLast = mmm[mmm.length - 1].sentAt;
		}

		if (activeChannel.name !== emptychannel.name) {
			getMessages(activeChannel.name, messageLast).then((res) => {
				if (res.Status === 200) {
					const newmsg = [...mmm.concat(res.Payload)];
					setMessages(newmsg);
				} else {
					alert("Fetching message failed with error code: " + res.Status);
				}
			}).catch((err) => {
				alert(err || err?.message || "Something went wrong!");
			});
		}
	}

	useEffect(() => {
		updateMessages();

		const interval = setInterval(() => {
			updateMessages();
		}, 2000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChannel]);

	useEffect(() => {
		handleScroll();
	}, [messages])

	const messagePane = (<><Grid xs={24}>
		<Grid.Container gap={2} direction="column">
			<Grid xs={22}>
				<Card width="100%" height="10px" style={{ border: "none" }}>
					<Description title={activeChannel.description} content={<b>Channel: {activeChannel.name.toUpperCase()}</b>} />
				</Card>
			</Grid>
			<Grid xs style={{ alignItems: "center", justifyContent: "flex-end", verticalAlign: "center" }}>
				<Button style={{ border: "none" }} onClick={() => { setModalIsOpen1(true); }}>
					<Trash2 />
				</Button>
			</Grid>
		</Grid.Container>
	</Grid>
		<Grid xs={24} >
			<Card shadow width="100%" height="590px" style={{ overflowY: "scroll" }}>
				{messages.map((message, i) => {
					const content = (
						<Text p mt={0}>
							{message.content}
						</Text>
					);
					const s = new Date(message.sentAt * 1000).toDateString()
					return (
						<Grid.Container style={{ margin: 15 }} key={message.id}>
							<Grid xs={21}>
								<Description title={message.sentByUsername} content={content} />
							</Grid>
							<Grid xs={3} alignItems="flex-start" alignContent="flex-end">
								<Text type="secondary" style={{ fontSize: "0.75rem" }}>{s}</Text>
							</Grid>
						</Grid.Container>)
				})}
				<div style={{ float: "left", clear: "both" }} ref={messageEndRef} />
			</Card>
		</Grid>
		<Grid xs={24}>
			<Card shadow width="100%" style={{ borderWidth: 0 }}>
				<Grid.Container>
					<Grid xs={22}>
						<Input placeholder="Message" width="100%" onChange={(e) => { setMsg(e.target.value) }} value={msg} />
					</Grid>
					<Grid xs={2}>
						<Button auto className="info-icon text-center" style={{ borderWidth: 0, justifyContent: "center", alignItems: "center" }} onClick={() => { sendMessage() }}>
							<Spacer inline w={0.1} />
							<Send />
						</Button>
					</Grid>
				</Grid.Container>
			</Card>
		</Grid></>);

	const sidebar = <Card width="100%" height="500px" paddingLeft="25%" style={{ borderWidth: 0 }}>
		<Text style={{ color: "#555", letterSpacing: "1.5px", fontSize: "0.8125rem", cursor: "pointer" }} onClick={() => { setTab("c"); setActiveChannel(emptychannel) }}>
			Hi, {sessionStorage.getItem("username") || "User"}!
		</Text>
		<Text style={{ color: "#888", letterSpacing: "1.5px", fontSize: "0.8125rem", cursor: "pointer" }} onClick={() => { setTab("c"); setActiveChannel(emptychannel) }}>
			ALL CHANNELS
		</Text>
		<Text style={{ color: "#888", letterSpacing: "1.5px", fontSize: "0.8125rem", cursor: "pointer" }} onClick={handleAddChannel}>ADD CHANNEL</Text>
		<Spacer h={0.5} />

		<Text style={{ color: "#888", letterSpacing: "1.5px", fontSize: "0.8125rem", cursor: "pointer" }} onClick={() => { setTab("p"); setActiveChannel(emptychannel) }}>
			ALL PEOPLE
		</Text>
		<Spacer h={0.5} />

		{channels.length === 0 ? <Text style={{ color: "#888", letterSpacing: "1.5px", fontSize: "0.8125rem" }}>
			You have no channels
		</Text> :
			<Text style={{ color: "#888", letterSpacing: "1.5px", fontSize: "0.8125rem" }} >
				Your channels
			</Text>
		}

		{channels.map((channel) => {
			return (
				<>
					<Link
						href={"/#" + channel.name}
						onClick={() => { setTab("m"); setMessages([]); setActiveChannel(channel); }}
						color={activeChannel.name === channel.name}
						key={channel.name}
					>
						# {channel.name}
					</Link>
					<Spacer h={0.2} />
				</>
			);
		})}
	</Card>;
	return (
		<Grid.Container gap={2} justify="center" >
			<Modal
				visible={modalIsOpen}
				onClose={closeModal}
			>
				<Modal.Title>Add Channel</Modal.Title>
				<div style={{ alignContent: "flex-start", alignItems: "flex-start", textAlign: "start" }}>
					<Input width="100%" placeholder="Enter Channel name" onChange={(e) => { setCname(e.target.value.toLowerCase()) }}>
						Channel Name
					</Input>
					<Spacer />
					<Input width="100%" placeholder="Enter Description" onChange={(e) => { setDescr(e.target.value) }}>
						Description
					</Input>
				</div>
				<Modal.Action passive onClick={closeModal}>
					<Spacer inline w={0.1} />
					Close<Spacer w={0.5} /> <X />
				</Modal.Action>
				<Modal.Action onClick={() => { addChannel() }}>
					<Spacer inline w={0.1} />
					Create Channel<Spacer w={0.5} /> <ArrowRight />
				</Modal.Action>

			</Modal>
			<Modal
				visible={modalIsOpen1}
				onClose={closeModal1}
			>
				<Modal.Title>Delete Channel</Modal.Title>
				<div style={{ alignContent: "flex-start", alignItems: "flex-start", textAlign: "start" }}>
					<b>Are your sure you want to delete cahnnel {activeChannel.name}?</b> <br />
					<small>
						Note: ALL messages will be deleted permanently.
					</small>
				</div>
				<Modal.Action onClick={closeModal1}>
					Close
				</Modal.Action>
				<Modal.Action passive onClick={() => { deleteChannel() }}>
					Yes delete!
				</Modal.Action>

			</Modal>
			<Grid xs={3} />
			<Grid xs={3} height="100%" alignContent="flex-end">
				{sidebar}
			</Grid>
			<Grid xs height="100%" >
				<Grid.Container gap={0.5} justify="center" direction="row">
					<Grid xs={24}>
						<Card style={{ border: "none" }} height="4px">
						</Card>
					</Grid>
					{tab === "p" ? <People setIsAuthenticated={setIsAuthenticated} /> : tab === "c" ? <Channel channels={channels} setchannels={setChannels} tick={tick} /> : messagePane}
				</Grid.Container>
			</Grid>
			<Grid xs={4} />
		</Grid.Container >
	);
}

export default InsideScreen;
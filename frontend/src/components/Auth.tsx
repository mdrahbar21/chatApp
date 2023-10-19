import { Card, Grid, Text, Spacer, Input, Button, Tabs } from "@geist-ui/core";
import { ArrowRight } from "@geist-ui/icons";
import React, { useState } from "react";
import { postSignup, SignupParams, postLogin, LoginParams } from "../api/callbacks";

interface Params {
	setIsAuthenticated: (value: React.SetStateAction<boolean>) => void
}

const AuthScreen: React.FC<Params> = ({ setIsAuthenticated }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [password1, setPassword1] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [design, setDesign] = useState("");
	const [avatar, setAvatar] = useState("");
	const [s, setS] = useState(false);

	const handleLogin = () => {
		if (!username || !password) {
			alert("Empty fields");
			return
		}

		const params: LoginParams = {
			Username: username,
			Password: password
		}

		postLogin(params).then(res => {
			if (res.Status !== 200) {
				alert("Failed with staus code " + res.Status);
			} else {
				sessionStorage.setItem("username", username);
				setIsAuthenticated(true);
			}
		})

	}
	const handleSignup = () => {
		if (!password1 || !password || !username || !name) {
			alert("Empty fields");
			return
		}
		if (password !== password1) {
			alert("Password mismatch");
			return
		}

		const params: SignupParams = {
			Name: name,
			Username: username,
			Password: password,
			PhoneNo: phone,
			Designation: design,
			AvatarURL: avatar
		}

		postSignup(params).then((res) => {
			if (res.Status !== 200) {
				alert("Failed with status code " + res.Status)
			} else {
				setS(true);
				setName("");
				setUsername("");
				setPassword("");
				setPassword1("");
				setPhone("");
				setDesign("");
				setAvatar("");

			}
		});
	}

	return (
		<Grid.Container gap={2} justify="center">
			<Grid xs={12}>
				<Card shadow width="100%" height="800px" style={{ borderWidth: 0 }}>
					<Text type="secondary" h2 className="center" width="100%" style={{ borderWidth: 0, justifyContent: "center", alignItems: "center", textAlign: "center" }} >
						Welcome to Channel!
					</Text>
					<Tabs initialValue="1" align="center" leftSpace={0}>
						<Tabs.Item label={<>Login</>} value="1">
							<Grid.Container gap={2} justify="center">
								<Grid>
									<Text h3 width="100%">Login</Text>
								</Grid>
								<Grid.Container gap={2} justify="center">
									<Grid xs={6}>
										<Input placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value) }}>
											Username
										</Input>
									</Grid>
									<Grid xs={6}>
										<Input.Password placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }}>
											Password
										</Input.Password>
									</Grid>
								</Grid.Container>
								<Grid >
									<Button
										auto
										className="info-icon text-center"
										onClick={() => { handleLogin() }}
										style={{ borderWidth: 0, justifyContent: "center", alignItems: "center" }}
									>
										<Spacer inline w={0.1} />
										Signin<Spacer w={0.5} /> <ArrowRight />
									</Button>
								</Grid>
							</Grid.Container>
						</Tabs.Item>
						<Tabs.Item label={<>Signup</>} value="2">
							<Grid.Container gap={2} justify="center">
								<Grid>
									<Text h3>Signup</Text>
								</Grid>
								<Grid.Container gap={2} justify="center">
									<Grid xs={6}>
										<Input placeholder="Enter Name" onChange={(e) => { setName(e.target.value) }} value={name}>
											Name
										</Input>
									</Grid>
									<Grid xs={6}>
										<Input placeholder="Enter Username" onChange={(e) => { setUsername(e.target.value) }} value={username}>
											Username
										</Input>
									</Grid>
								</Grid.Container>
								<Spacer />
								<Grid.Container gap={2} justify="center">
									<Grid xs={6}>
										<Input.Password placeholder="Enter Password" onChange={(e) => { setPassword(e.target.value) }} value={password}>
											Password
										</Input.Password>
									</Grid>
									<Grid xs={6}>
										<Input.Password placeholder="Re-Enter Password" onChange={(e) => { setPassword1(e.target.value) }} value={password1}>
											Confirm Password
										</Input.Password>
									</Grid>
								</Grid.Container>
								<Spacer />
								<Grid.Container gap={2} justify="center">
									<Grid xs={6}>
										<Input placeholder="Phone Number" onChange={(e) => { setPhone(e.target.value) }} value={phone}>
											Phone Number
										</Input>
									</Grid>
									<Grid xs={6}>
										<Input placeholder="Designation" onChange={(e) => { setDesign(e.target.value) }} value={design}>
											Designation
										</Input>
									</Grid>
								</Grid.Container>
								<Spacer />
								<Grid.Container gap={2} justify="center">
									<Grid xs={6}>
										<Input placeholder="Avatar URL" width="100%" onChange={(e) => { setAvatar(e.target.value) }} value={avatar}>
											Avatar URL
										</Input>
									</Grid>
								</Grid.Container>
								<Spacer />
								<Grid.Container gap={2} justify="center">

									<Grid >
										<Button
											auto
											className="info-icon text-center"
											onClick={() => { handleSignup() }}
											style={{ borderWidth: 0, justifyContent: "center", alignItems: "center" }}
										>
											<Spacer inline w={0.1} />
											Signup<Spacer w={0.5} /> <ArrowRight />
										</Button>
									</Grid>
								</Grid.Container>
								<Grid>
									{s && <Text h3>You can Login Now!</Text>}
								</Grid>
							</Grid.Container>
						</Tabs.Item>
					</Tabs>
				</Card>
			</Grid>
		</Grid.Container >
	);
};

export default AuthScreen;

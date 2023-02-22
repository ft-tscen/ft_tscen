import { useEffect, useState } from "react";
import { Form, Button, Container, Card, CloseButton , Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CreatRoom() {
	const navigate = useNavigate();
	const [roomName, setRoomName] = useState('');
	const [hasPassword, setHasPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [usePassword, setUsePassword] = useState<boolean>(false);

	const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// const value = e.target.value.replace(/[^A-Za-z0-9]/gi, "");
		// setRoomName(value.slice(0, 10));
		const roomName = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
		setRoomName(roomName);
	};
	
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// const value = e.target.value;
		// if (!setUsePassword || /^[a-zA-Z0-9!@#$%^&*()_+]{0,10}$/.test(value))
		// 	setPassword(value);
		const password = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
		setPassword(password);
	};

	const handleUsePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsePassword(e.target.checked);
		if (!e.target.checked) {
			setPassword("");
		}
	};
	
	const handleSubmit = () => {
		// e.preventDefault(); 
		if (usePassword)
			console.log(`Room: ${roomName}, Password: ${password}`);
		else
			console.log(`Room: ${roomName}`);
		// navigate("/normalGame");
	};

	const handleClickClose = () => {
		navigate("/");
	};

	return (
		<Container className="pt-5 mt-5">
			<Card className="bg-transparent border p-3">
				<Form>
				<CloseButton 
					aria-label="Hide" 
					variant="white" 
					onClick={handleClickClose}
				/>;
				<Card.Body>
					<Form.Group className="mb-3" controlId="formRoomName">
						<Form.Label className="text-white">Room Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter Room Name"
							onChange={handleRoomChange}
							value={roomName}
							onKeyPress={(e) => /[a-zA-Z0-9]/.test(e.key) || e.preventDefault()}
							className="bg-transparent text-white"
						/>
						<Form.Text className="text-muted">Up to 10 alphanumeric characters</Form.Text>
					</Form.Group>
					<Form.Group className="mb-3" controlId="password">
						<Form.Label className="text-white">PassWord</Form.Label>
						<Form.Control
							type="password"
							placeholder="Enter Password"
							className="bg-transparent text-white"
							onChange={handlePasswordChange}
							disabled={!usePassword}
							value={password}
							onKeyPress={(e) => /[a-zA-Z0-9]/.test(e.key) || e.preventDefault()}
						/>
						<Form.Text className="text-muted">
						Up to 10 characters, including letters, numbers, and special characters.
					</Form.Text>
					</Form.Group>
					<Form.Group className="mb-3">
					<Form.Check className="text-white"
						required
						type="checkbox"
						label="Use Password"
						feedbackType="invalid"
						checked={usePassword}
						onChange={handleUsePassword}
						/>
					</Form.Group>
						<div className="d-flex justify-content-end">
							<Button
								onClick={handleSubmit}
								className="w-100"
								variant="outline-light">
								방만들기
							</Button>
						</div>
					</Card.Body>
				</Form>
			</Card>
		</Container>
	)
}

export default CreatRoom;

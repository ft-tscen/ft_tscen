import { Button } from "react-bootstrap";

type BtnProps = {
	text: string;
	disable: boolean;
};

function Btn({ text, disable }: BtnProps) {
	return (
		<>
			<Button variant="outline-light" size="lg" disabled={!disable}>
				{text}
			</Button>
		</>
	);
}

export default Btn;

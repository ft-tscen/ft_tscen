import { Container } from "react-bootstrap";
import { Channel } from "./Channel";
import "./Effect.css";

export function Channels() {
	let b : { name:string, password:string|undefined }[] = [];
	for (let i :number = 1; i <= 35; ++i) {
        let pw :string|undefined = (i % 2 === 0 ? `${i}` : undefined);
        b.push({name :`${i}번 채널`, password :pw});
	}

	return (
		<Container className="m-0 p-0 mb-auto Scrollable" style={{ height:"81vmin" }}>
        {
            b.map((obj :{ name:string, password:string|undefined }, idx :number) => {
                return (
                    <Channel obj={obj}/>
                );
            })
        }
        </Container>
	);
}
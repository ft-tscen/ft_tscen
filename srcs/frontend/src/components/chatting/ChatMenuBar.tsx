import { Button, Col, Container, Row } from "react-bootstrap";
import { SHOW_CHANNEL, SHOW_CHATROOM } from "./types"

const CHANNEL : string = "Channel";
const CHATROOM : string = "Chatting";

export function ChatMenuBar({flag, setFlag} :{flag :boolean, setFlag :React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <Container className="w-100 pt-3 px-0">
      <Row
        className="px-3 text-center align-items-center justify-content-centor">
        <Col className="text-center align-items-center">
          <h4 style={{ color:"white", padding:"0", margin:"0" }}>
          { flag === SHOW_CHANNEL ? CHANNEL : CHATROOM }
          </h4>
        </Col>
        <Col md={4} className="p-0">
          <Button
            variant="outline-light"
            size="lg"
            onClick={() => {
              flag === SHOW_CHANNEL ? setFlag(SHOW_CHATROOM) : setFlag(SHOW_CHANNEL);
            }}>{ flag !== SHOW_CHANNEL ? CHANNEL : CHATROOM }
          </Button>
        </Col>
      </Row>
      <Row className="pt-3">
        <hr style={{ color:"white" }}/>
      </Row>
    </Container>
  );
};
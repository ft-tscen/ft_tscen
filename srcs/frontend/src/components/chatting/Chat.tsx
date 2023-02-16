import { Card, Row, Image } from "react-bootstrap";
import { Message } from "./types";

export function Chat({msg} :{ msg :Message }) {
  if (msg.name === "me") {
    return (
      <Row className="pt-1 h-auto justify-content-end">
        <Card className="d-flex h-auto w-75 p-0">
          <Card.Header>{msg.name}({msg.time})</Card.Header>
          <Card.Text className="px-2"> {msg.text}</Card.Text>
        </Card>
      </Row>
    )
  }
  else if (msg.name === "server"){
    return (
      <Row className="pt-1 h-auto justify-content-centor">
        <h1 style={{color:"red"}}>{msg.text}</h1>
      </Row>
    )
  }
  else {
    return (
      <Row className="pt-1 h-auto">
        <Image roundedCircle src="/img/Anonymous.jpeg" style={{width: "50px", height: "50px"}} className="p-0 me-2"/>
        <Card className="d-flex h-auto w-75 p-0">
          <Card.Header>{msg.name}({msg.time})</Card.Header>
          <Card.Text className="px-2"> {msg.text}</Card.Text>
        </Card>
      </Row>
    );
  }
}
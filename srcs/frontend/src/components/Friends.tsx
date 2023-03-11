import { Badge, ListGroup, Offcanvas } from "react-bootstrap";
import { UserData } from "../common/types";

type FriendsComponent = {
	show: boolean;
	handleClose: () => void;
	friends: UserData[];
};

function Friends({ show, handleClose, friends }: FriendsComponent) {
	return (
		<Offcanvas show={show} onHide={handleClose} style={{ overflowY: "scroll" }}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>친구 목록</Offcanvas.Title>
			</Offcanvas.Header>
			{friends.length === 0 ? (
				<Offcanvas.Body className="text-muted d-flex align-items-center justify-content-center">
					친구가 없습니다. 친구를 추가해보세요!
				</Offcanvas.Body>
			) : (
				<Offcanvas.Body>
					<ListGroup variant="flush">
						{friends.map(friend =>
						<>
						<ListGroup.Item className="d-flex justify-content-between">
							<Badge bg="primary" className="rounded-circle" style={{height: "1.5vmin", width: "1.5vmin"}}>
								<p></p>
							</Badge>
							{friend.nickname}
							{/* Status에 따른 색 추가 */}
						</ListGroup.Item>
						</>
					)}
					</ListGroup>
				</Offcanvas.Body>
			)}
		</Offcanvas>
	);
}

export default Friends;

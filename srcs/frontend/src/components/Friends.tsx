import { Offcanvas } from "react-bootstrap";

type FriendsComponent = {
	show: boolean;
	handleClose: () => void;
	friends: string[];
};

function Friends({ show, handleClose, friends }: FriendsComponent) {
	return (
		<Offcanvas show={show} onHide={handleClose}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>친구 목록</Offcanvas.Title>
			</Offcanvas.Header>
			{friends.length === 0 ? (
				<Offcanvas.Body className="text-muted d-flex align-items-center justify-content-center">
					친구가 없습니다. 친구를 추가해보세요!
				</Offcanvas.Body>
			) : (
				<Offcanvas.Body>sdf</Offcanvas.Body>
			)}
		</Offcanvas>
	);
}

export default Friends;

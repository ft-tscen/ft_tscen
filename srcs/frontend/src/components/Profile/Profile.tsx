import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveProfile from "./SaveProfile";
import ShowProfile from "./ShowProfile";

type ProfileComponent = {
	isLoggedIn: boolean;
	userData: {
		intraID: string;
		name: string;
		nickName: string;
		phone: string;
		verified: boolean;
	};
	isChangedData: boolean;
	setChangedData: (isChangedData: boolean) => any;
};

function Profile({
	isLoggedIn,
	userData,
	isChangedData,
	setChangedData,
}: ProfileComponent) {
	const [edit, setEdit] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {}, [edit]);

	if (isLoggedIn) {
		if (edit === true || userData.nickName === null) {
			return (
				<SaveProfile
					userData={userData}
					isChangedData={isChangedData}
					setChangedData={setChangedData}
				/>
			);
		} else {
			return <ShowProfile userData={userData} setEdit={setEdit} />;
		}
	} else navigate("/");
	return null;
}

export default Profile;

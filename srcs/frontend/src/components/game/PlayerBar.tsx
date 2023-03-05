import { useEffect, useState } from 'react';
import { gameMod, playerType } from '../../common/types';

type gameComponent = {
	mod: gameMod;
	playerInfo : playerType | undefined;
};

interface player {
	name: string | undefined;
	wins: number;
	losses: number;
}

function Player({ mod, playerInfo }: gameComponent) {
	const [lplayer, setLPlayer] = useState<player | null>(null);
	const [rplayer, setRPlayer] = useState<player | null>(null);

	useEffect(() => {
	if (mod !== gameMod.soloGame) {
		const getLPlayer = () => {
			let name;
			if (playerInfo?.p1.nickName)
				name = playerInfo?.p1.nickName;
			else
				name = "user";
			const wins = 5;
			const losses = 2;
			setLPlayer({ name, wins, losses });
		};

		const getRPlayer = () => {
			let name;
			if (playerInfo?.p2.nickName)
				name = playerInfo?.p2.nickName;
			else
				name = "user";
			const wins = 5;
			const losses = 2;
			setRPlayer({ name, wins, losses });
		};

		getLPlayer();
		getRPlayer();
	}

	}, []);

	return (
		<>
		{lplayer && rplayer && (
		<div style={{ display: "flex", height: "120px", color: "white" }}>
		<div style={{ display: "flex", flex: "1" }}>
		<div style={{ width: "120px", height: "120px", overflow: "hidden", borderRadius: "50%", marginRight: "20px" }}>
			<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style={{ width: "100%" }} />
		</div>
		<div>
			<h2 style={{ fontSize: '2rem', margin: 0 }}>{lplayer.name}</h2>
			<p style={{ fontSize: '1.5rem', margin: 0 }}>Wins: {lplayer.wins}</p>
			<p style={{ fontSize: '1.5rem', margin: 0 }}>Losses: {lplayer.losses}</p>
		</div>
		</div>
		<div style={{ width: "120px", display: "flex", alignItems: "flex-end" }}>
		</div>
		<div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
		<div style={{ textAlign: "right", paddingRight: "20px" }}>
			<h2 style={{ fontSize: '2rem', margin: 0 }}>{rplayer.name}</h2>
			<p style={{ fontSize: '1.5rem', margin: 0 }}>Wins: {rplayer.wins}</p>
			<p style={{ fontSize: '1.5rem', margin: 0 }}>Losses: {rplayer.losses}</p>
		</div>
		</div>
		<div style={{ width: "120px", height: "120px", overflow: "hidden", borderRadius: "50%" }}>
			<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" style={{ width: "100%" }} />
		</div>
		</div>
		)}
		</>
	);
}

export default Player;

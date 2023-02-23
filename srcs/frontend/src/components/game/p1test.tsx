import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Pool } from 'pg';

interface Player {
	name: string;
	wins: number;
	losses: number;
}

function P1() {
	const [player, setPlayer] = useState<Player | null>(null);

	useEffect(() => {

	const getPlayer = async () => {
		// const res = await pool.query('SELECT name, wins, losses FROM players WHERE id = $1', [1]);
		// const { name, wins, losses } = res.rows[0];
		const name = "user";
		const wins = 5;
		const losses = 2;
		setPlayer({ name, wins, losses });
	};

	getPlayer();
	}, []);

	return (
		<>
		{player && (
			<div style={{
				width: '100%',
				height: '10%',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				//   backgroundColor: '#FF5733',
				color: 'white',
			}}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div style={{ marginRight: '1rem' }}>
					<h2 style={{ fontSize: '2rem', margin: 0 }}>{player.name}</h2>
					<p style={{ fontSize: '1.5rem', margin: 0 }}>Wins: {player.wins}</p>
					<p style={{ fontSize: '1.5rem', margin: 0 }}>Losses: {player.losses}</p>
				</div>
				</div>
			</div>
		)}
		</>
	);
}

export default P1;

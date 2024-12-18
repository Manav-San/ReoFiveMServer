import * as React from 'react';
import { fetchNui } from '../utils/fetchNui';

import './vehicleUI.css'

const Home = () => {

	// React.useEffect(() => {
	// 	const handleMessage = (e: any) => {
	// 		const { action, data } = e.data;
			
	// 		if (action === 'something') {
	// 			console.log('UI has been called!');
	// 		}
	// 	};
	// 	window.addEventListener('message', handleMessage);
	// 	return () => window.removeEventListener('message', handleMessage);
	// }, []);

	

	async function close() {
		// closePage('Home');
		await fetchNui("closeMenu");
	}

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-4xl font-bold text-center'>Manav's Yeh Vehicle Summon UI</div>
			<div className='close'>
				<button onClick={close}>Close</button>
			</div>
		</div>
	);

	
};

export default Home;




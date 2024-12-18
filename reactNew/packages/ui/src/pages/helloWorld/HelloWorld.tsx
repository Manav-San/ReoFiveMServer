import React from 'react'
import { usePageContext } from '../../App'
import { fetchNui, useNuiQuery } from '../../utils/nui'
import { useExitListener } from '../../utils/exitListener'
import './hw.css'

type VehicleData = {
  vehicle: string;
  time: string;
};

const HelloWorldPage = () => {

  const [visible, setVisible] = React.useState(false);
  const [vehicle, setVehicle] = React.useState('');
  const [isHistoryVisible, setHistoryVisible] = React.useState(false);
  const [spawnData, setSpawnData] = React.useState<VehicleData[]>([]);


  React.useEffect(() => {
		const handleMessage = (e: {data : any }) => {
			const { action, data } = e.data;

      if( action === 'showHistory') {
        console.log("Spawn History has been successfully retrieved")
        setSpawnData(JSON.parse(data.vehicleSpawns));
        setHistoryVisible(true);
      }
		};
		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, []);

  const { closePage } = usePageContext()

  const query = useNuiQuery('getDemoData', null, {
    demo: true,
    inBrowser: true,
  })

  async function close() {
    closePage('HelloWorld')
    await fetchNui('closeMenu')
  }

  useExitListener(async () => {
    await close()
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle(e.target.value)
    
  }

  
  function getHistory() {
    handleShowHistory();
    fetchNui('showHistory');
    console.log('getting car history')
  }

  const handleShowHistory = () => {
    setHistoryVisible(true);
  };

  const handleCloseTable = () => {
    setHistoryVisible(false);
  };

  function getInput() {
    console.log("Input Received: " + vehicle)
    fetchNui('spawnVehicle', vehicle);
    setVisible(false);
    fetchNui('closeMenu');

  }

  return (
    <div className='grid align-items h-screen place-content-center p-10 text-white'>

        <div className="colorful-form-container">
            <div className="colorful-form">
                <div className="colorful-form-group">
                    <label htmlFor="vehicleName" className="colorful-label">
                        Vehicle Name:
                    </label>
                    <input
                        type="text"
                        id="vehicleName"
                        name="vehicleName"
                        placeholder="Enter vehicle name"
                        className="colorful-input"
                        onChange={handleInput}
                    />
                </div>
                <div className="colorful-button-group">
                    <button type="button" className="colorful-btn colorful-btn-submit" onClick={getInput}>
                        Submit
                    </button>
                    <button type="button" className="colorful-btn colorful-btn-form" onClick={close}>
                        Close
                    </button>
                    <button type="button" className="colorful-btn colorful-btn-history" onClick={getHistory} >
                        Show History
                    </button>
                </div>
            </div>
        </div>


        {isHistoryVisible && (<div className="vehicle-table-container">
            <div className="table-header">
                <button className="close-button" onClick={handleCloseTable}>
                    ✖
                </button>
            </div>
            <table className="vehicle-table">
                <thead>
                    <tr>
                        <th className="makeBlack">Vehicle</th>
                        <th className="makeBlack">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {spawnData.length > 0 ? (
                        spawnData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.vehicle}</td>
                                <td>{row.time}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="no-data">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>)}

    </div>
  )
}

export default HelloWorldPage

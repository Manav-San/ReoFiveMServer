import { RegisterNuiCB } from '@project-error/pe-utils'

const Delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

RegisterCommand(
  'sv',
  () => {
    SendNUIMessage({
      action: 'openPage',
      data: {
        pageName: 'HelloWorld',
      },
    })

    SetNuiFocus(true, true)
  },
  false,
)

RegisterNuiCB('closeMenu', (_, cb) => {
  SetNuiFocus(false, false)
  SendNUIMessage({
    action: 'closePage',
    data: {
      pageName: 'HelloWorld',
    },
  })

  cb(true)
})


RegisterNuiCB('retrieveData', (_, cb) => {
  const plName = GetPlayerName(PlayerId());

  SendNUIMessage({
    action: 'dataRetrieved',
    data: {
      playerName: plName,
    },
  })

  
})

RegisterNuiCB('showHistory', async (_, cb) => {

  await emitNet("retrieveHistory");
})

RegisterNuiCB('spawnVehicle', async (vehicle:string) => {

  const modelHash = GetHashKey(vehicle)

	if (!IsModelAVehicle(modelHash)) return
	RequestModel(modelHash)
	while (!HasModelLoaded(modelHash)) await Delay(100)

	const [x,y,z] = GetEntityCoords(PlayerPedId(), true)
	const h = GetEntityHeading(PlayerPedId())
	const veh = CreateVehicle(modelHash,x,y,z,h, true, true)

	while (!DoesEntityExist(veh)) await Delay(100)

	SetPedIntoVehicle(PlayerPedId(), veh, -1)

  emitNet("recordCar", vehicle);
})




onNet("sendHistoryToNUI", (jsonRows:JSON) => {
  SendNUIMessage({
    action: 'showHistory',
    data: {
      vehicleSpawns: jsonRows,
    },
  })
})

  RegisterKeyMapping('sv', 'VehicleSummonUI', 'keyboard', 'i');






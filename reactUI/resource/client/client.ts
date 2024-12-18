import config from '../shared/config';

RegisterCommand(
    'nuitest',
    () => {
        SendNUIMessage({
            action: 'openPage',
            data: {
                pageName: 'Home',
            },
        })

        SetNuiFocus(true, true);
    },
    false,
)

RegisterNuiCallback('closeMenu', (_: any, cb: any) => {
    SetNuiFocus(false, false)
    SendNUIMessage({
        action: 'closePage',
        data: {
            pageName: 'Home',
        },
    })

    cb(true);
})

// RegisterNuiCallback('getDemoData', (data: any, cb : any) => {
//     console.log(data);

//     cb({ demo: true, inBrowser: false })
// })

const ox = global.exports['oxmysql'];

function addPlayer(source:number) {
  console.log('Initiating Player Check')
  const player = source;
  const ID = getPlayerIdentifiers(player);
  const discordid = ID[1];

  const sqlCrt = `CREATE TABLE IF NOT EXISTS users (
    discord VARCHAR(255),
  )`;

  ox.execute(sqlCrt, [], (result:any) => {
    if(result.length > 1) {
      console.log("User table has been created")
    }
  });

  ox.execute('SELECT * FROM users WHERE discord = ?', [discordid], (result:any) => {
    if(result.length === 0) {
      ox.execute('INSERT INTO users (discord) VALUES (?)', [discordid], (result:any) => {
        if(result.length > 0) {
          console.log("Player added to db");
        }
      })
      
      const sql = `CREATE TABLE IF NOT EXISTS \`${discordid}\` (
        vehicle VARCHAR(255),
        time VARCHAR(255)
      )`;

      ox.execute(sql, [], (result:any) => {
        if(result.length > 1) {
          console.log("User vehicle spawn table has been created")
        }
      });
    } else {
      console.log("Player is already in db");
    }
  })
}

onNet("recordCar", (vehicle:string) => {
  console.log("Car is being recorded " + source)
  //get carhist from user db
  const now: Date = new Date();
  const formattedDate: string = now.toLocaleString();

  //global table where all user's vehicle spawns are logged
  ox.execute('INSERT INTO vehiclespawns (discord, carName) VALUES (?,?)', [getPlayerIdentifiers(source)[1], (vehicle.concat(('(' + formattedDate + ')')))], (result:any) => {
    if(result.length > 0) {
      console.log("vehicle spawn logged");
    }
  })

  ox.execute(`INSERT INTO \`${getPlayerIdentifiers(source)[1]}\` (vehicle, time) VALUES (?,?)`, [vehicle, formattedDate], (result:any) => {
    if(result.length > 0) {
      console.log("vehicle spawn logged");
    }
  })


})

function updateDb(modString:string) {
  ox.execute('UPDATE users SET carshist = ? WHERE discord = ?', [modString, getPlayerIdentifiers(source)[1]], (result:any) => {
    if(result.length > 0) {
      console.log("Car added to db");
    }
  })
}

onNet("retrieveHistory",  async ()=> {
  console.log("getting car spawn history from db");
  const sql = `SELECT * FROM \`${getPlayerIdentifiers(source)[1]}\``;
  const saveSource:number = source;
  
  ox.execute(sql, [], (result:any) => {
      if(result.length > 0) {
        console.log("History successfully received");
        
          const rows = result.map((row: any) => ({
            vehicle: row.vehicle,
            time: row.time
          }));

          emitNet("sendHistoryToNUI", saveSource, JSON.stringify(rows));
      }
  })


})


on('playerConnecting', () => {
  const source = global.source;
  addPlayer(source);
})

console.log('Server works!')




const configPath = "config.json";
const rawData = LoadResourceFile(GetCurrentResourceName(), configPath);

interface Config {
    roles: string[];
}

let cfg: any;

if (rawData !== null) {
    try {
        const config: Config = JSON.parse(rawData);
        cfg = config;
    } catch (error) {
        console.error('error parsing the file');
    } 
} else {
    console.error('error reading the file');
}

export { cfg }
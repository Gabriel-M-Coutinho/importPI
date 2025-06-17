import dowloadArquivos from "./dowload";
import unzipAllInDirectory from "./utils.js"

await dowloadArquivos();
await unzipAllInDirectory(directoryPath).catch(console.error);
const { TarsusStream } = require("tarsus-cli")

function TarsusLoaderFunc(structCode) {
    new TarsusStream(structCode, { isLoader: true });
    const data = Object.fromEntries(TarsusStream.struct_map)
    const toJson = JSON.stringify(data)

    let keys = Object.keys(data)
    let values = Object.values(data)
    let compileToVars = ``
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = values[index];
        compileToVars += `export  let ${key} = ${JSON.stringify(value)};\n  `
    }
    return `
        ${compileToVars};
        export default ${toJson};
    `;
}

module.exports = { TarsusLoaderFunc }
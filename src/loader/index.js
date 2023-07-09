const { TarsusStream } = require("tarsus-cli")

function compileInterFace(interfaceCode){
    let interfaces = [];

    for (let i = 0; i < interfaceCode.length; i++) {
      let str = interfaceCode[i];
      let parts = str.split(":");
      let returnType = parts[0].trim().split(" ")[0];
      let methodName = parts[0].trim().split("(")[0].split(" ")[1].trim();
      let reqType = parts[1].trim().split(",")[0].trim();
      let resType = parts[2].trim().split(")")[0].trim();
  
      let interfaceObj = {
        returnType: returnType,
        methodName: methodName,
        requestType: reqType,
        responseType: resType,
      };
      interfaces.push(interfaceObj);
    }
    return interfaces
}

/**
 * @template ->
 * import httpRequest from <AxiosPath>
 *  
 * export function <methoName>(data){
 *  return httpRequest({
 *      url:<interFace><mehodName>,
 *      method:"post",
 *      data
 *  })
 * }
 * 
 */
function compileToAxiosRequest(interFaceArr,options){
    const interFaceName = options.interFaceName.trim();
    const httpModule = options.httpModule;
    const HEAD = `
    import HTTPRequest from '${httpModule}';
    `
    let BODY = ``
    for (let index = 0; index < interFaceArr.length; index++) {
        const element = interFaceArr[index];
        const methodName = element.methodName.trim();
        BODY += `
        export function ${methodName}(data){
            return HTTPRequest({
                url:"${interFaceName}/${methodName}",
                method:"post",
                data
            })
        }\n
        ` 
    }
    return `
        ${HEAD} \n
        ${BODY}
    `
}


function TarsusLoaderFunc(structCode) {
    const options = this.getOptions();
    
    const httpModule = options.http;

    if(!httpModule){
        throw new Error(`
        options.http should be declared \n
        such as '@/utils/request' \n
        `)
    }

    const tarsusStream = new TarsusStream(structCode, { isLoader: true });
    const data = Object.fromEntries(TarsusStream.struct_map)
    const toJson = JSON.stringify(data)
    const interFaceArr = compileInterFace(tarsusStream._interFace)
    const interFaceName = tarsusStream._interFace_name;
    const getInterFaceExport = compileToAxiosRequest(interFaceArr,{httpModule,interFaceName});
    
    console.log(getInterFaceExport);

    let keys = Object.keys(data)
    let values = Object.values(data)
    let compileToVars = ``
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = values[index];
        compileToVars += `export  let ${key} = ${JSON.stringify(value)};\n  `
    }
    return `
        ${compileToVars};\n
        ${getInterFaceExport};\n
        export default ${toJson};
        
    `;
}

module.exports = { TarsusLoaderFunc }
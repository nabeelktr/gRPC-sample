import { fileURLToPath } from 'url';
import path from 'path'
import grpc from '@grpc/grpc-js'
import protLoader from '@grpc/proto-loader'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefenition = protLoader.loadSync(path.join(__dirname, '../protos/processing.proto'))
const processingProto = grpc.loadPackageDefinition(packageDefenition)

function process(call ){
    const onboardRequest = call.request;
    let time = onboardRequest.orderId * 1000 + onboardRequest.degreeId * 10;
    call.write({ status: 0 });
    call.write({ status: 1 });
    setTimeout(()=> {
        call.write({ status: 2 });
        setTimeout(()=>{
            call.write({ status: 3 });
            call.end();
        },time)
    },time)
}

const server = new grpc.Server()
server.addService(processingProto.Processing.service, { process });
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
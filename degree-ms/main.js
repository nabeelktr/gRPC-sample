import { fileURLToPath } from 'url';
import path from 'path'
import grpc from '@grpc/grpc-js'
import protLoader from '@grpc/proto-loader'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDefenition = protLoader.loadSync(path.join(__dirname, '../protos/degree.proto'))
const degreeProto = grpc.loadPackageDefinition(packageDefenition)

const DEGREE = [
    {
        id: 100,
        degreeId: 1000,
        title: 'Engineering',
        major: 'Electronics'
    },
    {
        id: 200,
        degreeId: 2000,
        title: 'Engineering',
        major: 'Computer Science'
    },
    {
        id: 300,
        degreeId: 3000,
        title: 'Engineering',
        major: 'Telecommunication'
    },
    {
        id: 400,
        degreeId: 4000,
        title: 'Commerce',
        major: 'Accounts'
    }
];

function findDegree(call, callback){
    let degree = DEGREE.find((deg) => deg.degreeId === call.request.id)
    if(degree){
        callback(null, degree)
    }else{
        callback({
            message: 'Degree not found',
            code: grpc.status.INVALID_ARGUMENT
        })
    }
}

const server = new grpc.Server();
server.addService(degreeProto.Degrees.service, { find: findDegree });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});
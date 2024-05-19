import swaggerJSDoc from "swagger-jsdoc";
//ubicar archivos 
import path from 'path';
// export const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Fleet Management API',
//       version: '1.0.0',
//       description: 'API taxis',
//     },
//     servers: [
//         {
//             url: 'http://localhost:3000'
//         }
//     ]
//   },
//   apis: ['./routes/*.ts'], 
// };



const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fleet Management Api Documentation',
      version: '1.0.0',
    }
  },
  apis: [path.join(__dirname, './routes/*.ts')]
};

const swaggerSpec =swaggerJSDoc(options)

export default swaggerSpec 
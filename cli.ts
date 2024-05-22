import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import promptSync from 'prompt-sync';

interface Arguments {
  type: 'taxis' | 'trajectories';
  folder: string;
  dbname: string;
  host: string;
  port: number;
  username: string;
}

// Configuración de yargs para leer los parámetros de la línea de comandos
const argv = yargs(hideBin(process.argv))
  .option('type', {
    alias: 't',
    describe: 'Tipo de datos (taxis|trajectories)',
    demandOption: true,
    choices: ['taxis', 'trajectories'] as const,
  })
  .option('folder', {
    describe: 'Ruta de la carpeta de datos',
    demandOption: true,
  })
  .option('dbname', {
    describe: 'Nombre de la base de datos a la que conectarse',
    demandOption: true,
  })
  .option('host', {
    describe: 'Nombre del host de la base de datos',
    demandOption: true,
  })
  .option('port', {
    describe: 'Puerto TCP de la base de datos',
    demandOption: true,
    type: 'number',
  })
  .option('username', {
    describe: 'Usuario para conectarse a la base de datos',
    demandOption: true,
  })
  .parseSync();

const { type, folder, dbname, host, port, username } = argv as unknown as Arguments;

// Solicitar la contraseña de manera interactiva usando prompt-sync
const prompt = promptSync({ sigint: true });
const password = prompt('Ingrese la contraseña de la base de datos: ', { echo: '*' });

// Configurar el Prisma Client con los parámetros proporcionados
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgresql://${username}:${password}@${host}:${port}/${dbname}`,
    },
  },
});

const processFile = async (file: string) => {
  const fileContent = fs.readFileSync(file, 'utf-8');
  const rows = fileContent.trim().split('\n');

  if (type === 'taxis') {
    await prisma.$transaction(
      rows.map((row) => {
        const [id, plate] = row.split(',');
        return prisma.taxis.upsert({
          where: { id: parseInt(id) },
          update: { plate: plate.trim() }, // Actualizar si ya existe
          create: { id: parseInt(id), plate: plate.trim() }, // Crear si no existe
        });
      })
    );
  } else if (type === 'trajectories') {
    await prisma.$transaction(
      rows.map((row) => {
        const [taxi_id, date, latitude, longitude] = row.split(',');
        return prisma.trajectories.create({
          data: {
            taxi_id: parseInt(taxi_id), 
            date: date ? new Date(date) : null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
          },
        });
      })
    );
  }}

const insertData = async () => {
  try {
    const files = fs.readdirSync(folder).filter(file => file.endsWith('.txt'));
    for (const file of files) {
      const filePath = path.join(folder, file);
      await processFile(filePath);
    }
    console.log('Datos cargados exitosamente');
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}; 

insertData();

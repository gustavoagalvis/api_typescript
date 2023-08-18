/* eslint-disable no-async-promise-executor */

/*
  En este archivo se definen las funciones que se encargan de interactuar con la base de datos.}
  Se usa mongoose para interactuar con la base de datos.
*/
import { UserSchema } from '../schemas/users.schema';
import { User } from '../types/user.types';


const readUsers = (): Promise<User[]> => { // Se define el tipo de dato que devuelve la función, en este caso una promesa que devuelve un arreglo de clientes.
  return new Promise( async (resolve, reject) => { // Se devuelve una promesa para manejar el asincronismo.
    try {
      const mongoResponse = await UserSchema.find(); // Usando mongoose se obtienen todos los datos de la colección de clientes.
      resolve(mongoResponse); // Se devuelve el arreglo de clientes.
    } catch (error) { // Si hay un error, se devuelve el error.
      reject(error); // Se devuelve el error.
    }
  });
};

const readUserEmail = (email: string): Promise<User[]> => {
  return new Promise( async (resolve, reject) => {
    try {
      
      const mongoResponse = await UserSchema.find({ email: email }); // Usando mongoose se obtiene el cliente por su email.

      if(mongoResponse === null){ // Si el cliente no existe, se devuelve un error 404.
        reject(404); // Se devuelve el código de error.
      }else{
        resolve(mongoResponse); // Si el cliente existe, se devuelve el cliente. En caso de haber varios clientes con el mismo email, se devuelve un arreglo.
      }
    }catch(error){
      reject(error); // En caso de error se devuelve el error.
    }
  });
};



export { 
  readUserEmail,
  readUsers
}; // Se exportan las funciones para que puedan ser usada en otros archivos.

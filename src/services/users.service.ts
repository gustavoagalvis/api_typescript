/*
En la capa de servicio o gestión de lógica de negocio se hacen validaciones, cálculos y en general la gestión de los algoritmos que se requieran para el funcionamiento de la aplicación. 
*/

import { readUserEmail, readUsers } from '../data/users.data';
import { User } from '../types/user.types';



// Se define el tipo de dato que devuelve la función, en este caso una promesa que devuelve un arreglo de clientes.
// Los datos son devueltos en un objeto que contiene un código de respuesta, un mensaje y el resultado. El unico campo obligatorio es el código de respuesta.
interface ServiceLayerResponse {
  code: number,
  result?: User | User[],
  message?: string;
  errorMessage?: unknown,
}


const getUserByEmail = (email: string): Promise<ServiceLayerResponse> => {
  return new Promise((resolve, reject) => {
    readUserEmail(email)
      .then((dataLayerResponse) => { // dataLayerResponse es un arreglo de clientes.
        if((dataLayerResponse as User[]).length === 0){ // Se valida si la respuesta es un arreglo vacío.
          resolve({ code: 404 , message: 'Usuario no existe' }); // Se devuelve un código de respuesta 404 y un mensaje.
        }else{
          resolve({ code: 200, result: dataLayerResponse[0] as User }); // En caso de haber varios clientes con el mismo email, se devuelve el primero.
        }
      })
      .catch(error => {
        reject({code: 500, message: "Error inesperado", errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
      });
  });
};

// Esta función se encarga de obtener los clientes. Puede recibir un límite para la cantidad de clientes que se devuelven.
const getUsers = (): Promise<ServiceLayerResponse> => {
  // Se devuelve una promesa para manejar el asincronismo.
  return new Promise((resolve, reject) => {
    readUsers() // La función readCustomers recibe el límite como parámetro. Se usa "as" para indicar que el tipo de dato es string.
      .then((dataLayerResponse: User[]) => {  // Se accede a la respuesta de la capa de datos.

        const localCustomersDB = dataLayerResponse; // Se guarda la respuesta de la capa de datos en una variable local.
        resolve({ code: 200, result: localCustomersDB}); // Se devuelve el arreglo de clientes.
      })
      .catch((error) => { // Si hay un error, se devuelve el error. El tipo de dato es Error.
        reject({code: 500, message: "Error inesperado ", errorMessage: error }); 
      });
  });
};
// Esta función se encarga de obtener un cliente por su id. Es una función asíncrona que retorna una promesa y recibe como parámetro el id del cliente.
// const getUserById = (id: string): Promise<ServiceLayerResponse> => {
//   return new Promise((resolve, reject) => {
//     readUserById(id)
//       .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
//         if((dataLayerResponse as User[]).length === 0){ // Se valida si la respuesta es un arreglo vacío.
//           resolve({ code: 404 , message: 'Cliente no existe' }); // Se devuelve un código de respuesta 404 y un mensaje.
//         }else{
//           resolve({ code: 200, result: dataLayerResponse as User }); // Se devuelve un código de respuesta 200 y el cliente.
//         }
//       })
//       .catch(error => {
//         reject({code: 500, message: "Error inesperado", errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
//       });
//   });
// };

// // Esta función se encarga de obtener un cliente por su nombre. Es una función asíncrona que retorna una promesa y recibe como parámetro el nombre del cliente.
// const getUserByEmail = (email: string, password: string): Promise<ServiceLayerResponse> => {
//   return new Promise((resolve, reject) => {
//     login(email) // Se llama la función de la capa de datos.
//       .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
//         if((dataLayerResponse as User[]).length === 0){ // Se valida si la respuesta es un arreglo vacío.
//           resolve({ code: 404 , message: 'Usuario no existe' }); // Se devuelve un código de respuesta 404 y un mensaje.
//         }else{
//           resolve({ code: 200, result: dataLayerResponse as User }); // Se devuelve un código de respuesta 200 y el cliente.
//         }
//       })
//       .catch(error => {
//         reject({code: 500, message: "Error inesperado", errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
//       });
//   });
// };



export {
  getUserByEmail,
  getUsers
  // getUserById
}; // Se exportan la funciones para que pueda ser usada en otros archivos.
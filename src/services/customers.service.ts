/*
En la capa de servicio o gestión de lógica de negocio se hacen validaciones, cálculos y en general la gestión de los algoritmos que se requieran para el funcionamiento de la aplicación. 
*/
import { Customer } from '../types/customers.types';
import {
  readCustomers,
  readCustomerById,
  readCustomerByName,
  createCustomer,
  updateCustomer,
  deleteCustomerById
} from '../data/customers.data';


// Se define el tipo de dato que devuelve la función, en este caso una promesa que devuelve un arreglo de clientes.
// Los datos son devueltos en un objeto que contiene un código de respuesta, un mensaje y el resultado. El unico campo obligatorio es el código de respuesta.
interface ServiceLayerResponse {
  code: number,
  result?: Customer | Customer[],
  message?: string;
  errorMessage?: unknown,
}

// Esta función se encarga de obtener los clientes. Puede recibir un límite para la cantidad de clientes que se devuelven.
const getCustomers = (): Promise<ServiceLayerResponse> => {
  // Se devuelve una promesa para manejar el asincronismo.
  return new Promise((resolve, reject) => {
    readCustomers() // La función readCustomers recibe el límite como parámetro. Se usa "as" para indicar que el tipo de dato es string.
      .then((dataLayerResponse: Customer[]) => {  // Se accede a la respuesta de la capa de datos.

        const localCustomersDB = dataLayerResponse; // Se guarda la respuesta de la capa de datos en una variable local.
        resolve({ code: 200, result: localCustomersDB}); // Se devuelve el arreglo de clientes.
      })
      .catch((error) => { // Si hay un error, se devuelve el error. El tipo de dato es Error.
        reject({code: 500, message: "Error inesperado ", errorMessage: error }); 
      });
  });
};

// Esta función se encarga de obtener un cliente por su id. Es una función asíncrona que retorna una promesa y recibe como parámetro el id del cliente.
const getCustomerById = (id: string): Promise<ServiceLayerResponse> => {
  return new Promise((resolve, reject) => {
    readCustomerById(id)
      .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
        if((dataLayerResponse as Customer[]).length === 0){ // Se valida si la respuesta es un arreglo vacío.
          resolve({ code: 404 , message: 'Cliente no existe' }); // Se devuelve un código de respuesta 404 y un mensaje.
        }else{
          resolve({ code: 200, result: dataLayerResponse as Customer }); // Se devuelve un código de respuesta 200 y el cliente.
        }
      })
      .catch(error => {
        reject({code: 500, message: "Error inesperado", errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
      });
  });
};

// Esta función se encarga de obtener un cliente por su nombre. Es una función asíncrona que retorna una promesa y recibe como parámetro el nombre del cliente.
const getCustomerByName = (name: string): Promise<ServiceLayerResponse> => {
  return new Promise((resolve, reject) => {
    readCustomerByName(name) // Se llama la función de la capa de datos.
      .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
        if((dataLayerResponse as Customer[]).length === 0){ // Se valida si la respuesta es un arreglo vacío.
          resolve({ code: 404 , message: 'Cliente no existe' }); // Se devuelve un código de respuesta 404 y un mensaje.
        }else{
          resolve({ code: 200, result: dataLayerResponse as Customer }); // Se devuelve un código de respuesta 200 y el cliente.
        }
      })
      .catch(error => {
        reject({code: 500, message: "Error inesperado", errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
      });
  });
};

// Esta función se encarga de crear un cliente. Es una función asíncrona que retorna una promesa y recibe como parámetro el cliente a guardar.
const postCustomer = (body: Customer): Promise<ServiceLayerResponse> => {
  return new Promise((resolve, reject) => {
    createCustomer(body) // Se llama la función de la capa de datos.
      .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
        resolve({code: 201, message: dataLayerResponse as string }); // Se devuelve un código de respuesta 201 y un mensaje.
      })
      .catch(error => {
        reject({code: 500, message: "Error inesperado", errorMessage: error }); // Se devuelve un código de respuesta 500 y el error.
      });
  });
};

// Esta función se encarga de actualizar un cliente. Es una función asíncrona que retorna una promesa y recibe como parámetro el id del cliente y la información del cliente a actualizar.
const putCustomer = (id: string, body: Customer): Promise<ServiceLayerResponse> => {
  return new Promise((resolve, reject) => {
    updateCustomer(id, body) // Se llama la función de la capa de datos.
      .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
        if(dataLayerResponse === 200)( // Se valida si la respuesta es un código de respuesta 200.
          resolve({code: 200, message: 'Cliente actualizado exitosamente' as string }) // Se devuelve un código de respuesta 200 y un mensaje.
        );
      })
      .catch(error =>{
        if(error === 404){ // Se valida si la respuesta es un código de respuesta 404.
          reject({ code: 404, message: 'Cliente no encontrado'}); // Se devuelve un código de respuesta 404 y un mensaje.
        }else{
          reject({ code: 500, message: 'Unexpected error', errorMessage: error}); // Se devuelve un código de respuesta 500 y el error.
        }
      });
  });
};

// Esta función se encarga de borrar un cliente. Es una función asíncrona que retorna una promesa y recibe como parámetro el id del cliente a borrar.
const deleteCustomer = (id: string): Promise<ServiceLayerResponse>  => {
  return new Promise((resolve, reject) => {
    deleteCustomerById(id) // Se llama la función de la capa de datos.
      .then((dataLayerResponse) => { // Se accede a la respuesta de la capa de datos.
        if(dataLayerResponse === 200){ // Se valida si la respuesta es un código de respuesta 200.
          resolve({ code: 200, message: "Cliente borrado"}); // Se devuelve un código de respuesta 200 y un mensaje.
        }
      })
      .catch((error) => {
        if(error === 404){ // Se valida si la respuesta es un código de respuesta 404.
          reject({code: 404, message: "Cliente no existe"}); // Se devuelve un código de respuesta 404 y un mensaje.
        }else{
          reject({ code: 500, message: "Error inesperado", errorMessage: error }); // Se devuelve un código de respuesta 500 y el error.
        }
      });
  });
};

export {
  getCustomers,
  getCustomerById,
  getCustomerByName,
  postCustomer,
  putCustomer,
  deleteCustomer
}; // Se exportan la funciones para que pueda ser usada en otros archivos.
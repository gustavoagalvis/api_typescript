/*
Esta capa se encarga de gestionar la petición hecha por el cliente, sea de tipo HTTP, o eventos de la aplicación.

Para este caso puntual, se encarga de gestionar las peticiones de tipo GET, POST, PUT, DELETE y PATCH para la entidad de clientes. Y la gestión de los código de estado HTTP.

Para esto, se usa el módulo "express" que se instaló previamente. Este módulo permite gestionar las rutas de la aplicación, y las peticiones que se hacen a cada ruta.
*/
import express from 'express'; // Se importa el módulo express.

import {
  getUserByEmail, getUsers,
} from '../services/users.service'; // Se importa la función que obtiene los clientes. Especificando el path relativo al archivo, es hacia la capa de servicios (Lógica de negocio).
import { User } from '../types/user.types';

const router = express.Router(); // El modulo router de express sirve para gestionar las rutas de la aplicación.


// Se declara la interfaz para el formato de los errores personalizados, para que sea más fácil de manejar. 
//Tiene 3 propiedades: code, message y errorMessage, donde code es el código de estado HTTP, message es el mensaje que se devuelve al cliente, y errorMessage es el error que se devuelve en la consola.
interface CustomErrorFormat {
  code: number,
  message: string,
  errorMessage: unknown
}

// Esta petición de tipo get obtiene un cliente por su nombre.
router.get('/email/:email', async (req,res) => {
  try{
    const email = req.params.email; // Se obtiene el nombre del parámetro de la petición y se guarda en una variable.
    
    const serviceLayerResponse = await getUserByEmail(email); // Se llama a la función de la capa de servicios que se encarga específicamente de traer un cliente por su nombre (getCustomerByName)
    res.status(serviceLayerResponse.code).json(serviceLayerResponse.result);
  }catch(error){
    const customError = error as CustomErrorFormat;
    console.log(customError.errorMessage);
    res.status(customError.code ).json(customError.message );
  }
});

router.post('/login', async (req, res) =>{
  const email = req.body.email; // Se guarda el email del body de la petición en una variable.
  const serviceLayerResponse = await getUserByEmail(email); //Se llama a la función de la capa de servicios pasandole el email del body de la petición, debe retornar los datos del empleado.

  if(serviceLayerResponse.code === 404){ // Si el código de respuesta es 404, significa que no se encontró el empleado en la BD.
    res.json(serviceLayerResponse).status(serviceLayerResponse.code); // Se devuelve el código de error y el mensaje de error.
  }else{
    const user  = serviceLayerResponse.result; // Se guarda los datos del empleado en una variable.
    // En la siguiente validación se verifica que el email del body de la petición sea igual al email del empleado de la BD y que la contraseña del body de la petición sea igual a la contraseña del empleado de la BD.
    if(email === (user as User).email){ // Si la validación es correcta, se procede a generar el token.
      res.status(200).json({email}); // Se devuelve el token y el código de estado 200.
    }else{
      res.status(403).json({message: "Usuario o contraseña incorrectos"}); // Si la validación no es correcta, se devuelve un mensaje de error y el código de estado 403 (Forbidden) que significa que el usuario no permisos.
    }
  }
});

router.get('', async (req, res) => {
  try{
    const serviceLayerResponse = await getUsers(); // Se llama a la función de la capa de servicios que se encarga específicamente de traer los usuarios (getCustomers)

    res.status(serviceLayerResponse.code).json({ result: serviceLayerResponse.result }); // Se devuelve el arreglo de clientes. Se devuelve un objeto con la propiedad result, para que sea más fácil de manejar en el cliente.
  }catch(error){ // Si hay un error, se devuelve el error.
    const customError = error as CustomErrorFormat; // Se castea el error a la interfaz de errores personalizados.
    console.log(customError.errorMessage); // Se imprime el error en la consola.
    res.status(customError.code ).json(customError.message ); // Se devuelve el error al cliente.
  }
});
// Esta petición de tipo delete elimina un cliente con base en el id pasado por parámetro.


export default router;
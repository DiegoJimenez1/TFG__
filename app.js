const axios = require('axios').default;
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const bcrypt = require('bcryptjs');
const cron = require('node-cron')

const pdfkit = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');

var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");

const path = require('path');
const { Console } = require('console');



 
var precio,hora,unidades,fecha;
var CODIGOS_PROV = new Array(
  new Array(  "01",	"Álava"	,"VI"),
  new Array(  "02",	"Albacete"	,"AB"),
   new Array( "03",	"Alicante",	"A"),
    new Array( "04",	"Almería",	"AL"),
   new Array( "05",	"Ávila"	,"AV"),
    new Array( "06",	"Badajoz",	"BA"),
   new Array( "07",	"Baleares",	"PM / IB"),
    new Array("08",	"Barcelona",	"B"),
    new Array("09",	"Burgos",	"BU"),
    new Array("10",	"Cáceres",	"CC"),
    new Array("11",	"Cádiz",	"CA"),
    new Array("12",	"Castellón",	"CS"),
    new Array("13",	"Ciudad Real",	"CR"),
    new Array("14",	"Córdoba",	"CO"),
   new Array( "15",	"La Coruña",	"C"),
    new Array("16",	"Cuenca",	"CU"),
    new Array("17",	"Gerona",	"GE / GI"),
    new Array("18",	"Granada",	"GR"),
    new Array("19",	"Guadalajara",	"GU"),
    new Array("20",	"Guipúzcoa",	"SS"),
   new Array( "21",	"Huelva",	"H"),
   new Array( "22",	"Huesca",	"HU"),
   new Array( "23",	"Jaén",	"J"),
    new Array("24",	"León",	"LE"),
    new Array("25",	"Lérida",	"L"),
   new Array( "26",	"La Rioja",	"LO"),
   new Array( "27",	"Lugo",	"LU"),
   new Array( "28",	"Madrid",	"M"),
   new Array( "29",	"Málaga","MA"),
   new Array( "30",	"Murcia",	"MU"),
   new Array( "31",	"Navarra",	"NA"),
    new Array("32",	"Orense",	"OR / OU"),
   new Array( "33",	"Asturias",	"O"),
   new Array( "34",	"Palencia",	"P"),
   new Array( "35",	"Las Palmas",	"GC"),
   new Array( "36",	"Pontevedra",	"PO"),
   new Array( "37",	"Salamanca",	"SA"),
    new Array("38",	"Santa Cruz de Tenerife",	"TF"),
    new Array("39",	"Cantabria",	"S"),
    new Array("40",	"Segovia",	"SG"),
    new Array("41",	"Sevilla",	"SE"),
   new Array( "42",	"Soria"	,"SO"),
   new Array( "43",	"Tarragona",	"T"),
   new Array( "44",	"Teruel",	"TE"),
    new Array("45",	"Toledo","TO"),
    new Array("46",	"Valencia",	"V"),
    new Array("47",	"Valladolid",	"VA"),
    new Array("48",	"Vizcaya",	"BI"),
    new Array("49",	"Zamora",	"ZA"),
   new Array( "50",	"Zaragoza",	"Z"),
   new Array( "51",	"Ceuta",	"CE"),
    new Array("52",	"Melilla",	"ML")
)
const app = express();
app.use(bodyParser.json());

app.use(cors()) 


// cron.schedule('* * * * *', () => {
//     console.log('Esta tarea se ejecuta cada minuto');
//   });


//cron.schedule('0 */6 * * *', () => {
   //----------------------------------leer datos api -------------------------------------------//

    console.log("******************************************* la hora actual es *******************************************************")
   console.log("estoy rama nube");
    // crea un nuevo objeto `Date`
    var today = new Date();
 
    // obtener la fecha y la hora
    var now = today.toLocaleString();
    console.log(now);

   let url = 'https://api.preciodelaluz.org/v1/prices/all?zone=PCB'

 

    //cron.schedule('0 */12 * * *', () => {

        console.log('Esta tarea se ejecuta cada 12 horas');
        console.log("y son las : ")
        console.log(now)
  
        // Lectura precios dia las 24 horas


        axios.get(url,{

        })
        .then((response) => {
            
            
            let aux = Object.values(response.data);

            var values_precio = [];
            var date1 = (new Date()).toISOString().split('T')[0];
            console.log("la fecha de hoy es :");
            console.log(aux[0].date);
            var fecha1 = aux[0].date;

            //--------------------------------------------------------------------------------------//
            //--------------------------------------------------------------------------------------//

            var sql = "INSERT INTO precios (precio, hora, unidades, Fecha_string) VALUES ?";
            var sql_ = `SELECT * FROM precios WHERE Fecha_string = "${fecha1}"`;

                    //CONEXION LOCAL    
                   
                    /*
                    var conexion = mysql.createConnection({
                        host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
                        database:"b8gyoaad4emvcrwuwtra",
                        user:"uoxipcxsxq7neldz",
                        password:"emZVDmwZxUMHrha8bhAL",
                    
                    });*/

                    var conexion = mysql.createConnection({
                        host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
                        database:"b8gyoaad4emvcrwuwtra",
                        user:"uoxipcxsxq7neldz",
                        password:"emZVDmwZxUMHrha8bhAL",
                    
                    });

                    conexion.connect(function(error){
                        if(error){
                            throw error;
                        }else{
                            console.log('CONEXION EXITOSA 1');
                        }
                    });
                
                conexion.query(sql_,(error,result)=>{
                    if (error) throw error;

                    if ( result.length > 0){
                        //console.log(result);
                        console.log(`fecha : '${fecha1}'`)
                        //console.log("result :")
                        //console.log(result)
                        console.log("si que existe");
                        //conexion.end();
                    }else{
                        console.log("no existe");
                        fecha = aux[0].date;
                            
                        console.log("fecha es ahora :");
                            console.log(fecha);
                        
                        for ( let i = 0; i < Object.values(response.data).length ; i++){
                            
                        
                            precio = aux[i].price;
                            hora = aux[i].hour;
                            unidades = aux[i].units;
                            fecha = aux[i].date;
                        
                            var value_=[[precio,hora,unidades,fecha]];
                            conexion.query(sql, [value_], function (err, result) {
                                if (err) throw err;
                                console.log(result)
                                console.log("Number of records inserted: " + result.affectedRows);
                            });
                        } 
                        //conexion.end(); 
                    }
                });
        

        })
        .catch(err => {
            console.log(err);
        })

        console.log("inicio peticion precios media")

        let url2 = 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB'
                axios.get(url2,{

                })
                .then((response) => { 

                    var respuesta = response.data;
                    console.log(respuesta);
                    var fecha2 = respuesta.date;
                    var Precio2 = respuesta.price;
                    var unidades2= respuesta.units;
                    console.log(fecha2);
                    var Media_dia=[[fecha2,Precio2,unidades2]];

                    //------------------------------------------------------------------------------------------------//
                
                    var sql2 = `INSERT INTO Precios_media (fecha,precio,unidades) VALUES ?`;
                    var sql3 = `SELECT * FROM Precios_media WHERE fecha = "${fecha2}"`;

                    
                        // var conexion = mysql.createConnection({
                        //     host:"localhost",
                        //     database:"prueba",
                        //     user:"admin",
                        //     password:"admin2Pass=",
                        
                        // });
                            
                        var conexion = mysql.createConnection({
                            host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
                            database:"b8gyoaad4emvcrwuwtra",
                            user:"uoxipcxsxq7neldz",
                            password:"emZVDmwZxUMHrha8bhAL",
                        
                        });

                        conexion.connect(function(error){
                            if(error){
                                    throw error;
                            }else{
                                    console.log('CONEXION EXITOSA 2');
                            }
                        });

                        conexion.query(sql3,(error,result)=>{
                            if (error) throw error;

                            if ( result.length > 0){
                                    //console.log(result);
                                    console.log("si que existe para esta fecha media ");
                                    //conexion.end();
                            }else{
                                    console.log("nuevo dia");
                                    console.log(Media_dia)
                                    conexion.query(sql2,[Media_dia],  function (err, result) {
                                        if (err) throw err;
                                        console.log("Number of records inserted: " + result.affectedRows);
                                    });
                                
                                }

                            });
                            // conexion.end();

                    })
                .catch(err => {
                    console.log(err);
                })


                
//})
//         //--------------------------PRECIOS GASOLINA-----------------------------------------//
//             app.get('/PreciosProvincia/:provincia',(req,res) => {
//                 console.log(req.params)
//                 console.log(req.params.provincia)
//                 var provincia
                
                
//                 for(let i = 0 ; i <= CODIGOS_PROV.length-1; i++){
                    
//                     if(CODIGOS_PROV[i][1] == req.params.provincia){
//                         provincia = CODIGOS_PROV[i][0]
//                     }

//                 }
                
               
//                 console.log(provincia)

//                 let url_GASOLINA = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${provincia}`
//                 let url_test = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/140" 
//                 axios.get(url_GASOLINA,{

//                 })
//                 .then((response) => {
//                     //console.log(response.data)
//                     console.log(response.data.ListaEESSPrecio[2])
//                     var tamaño = response.data.ListaEESSPrecio.length
//                     console.log("el tamamño es : ", tamaño)
//                     res.json(response.data.ListaEESSPrecio)
//                 })
                
            
//             })

//                             //--------------------------------------------------------------------------------------------//
//                 //--------------------------------------------------------------------------------------------//

//                 let url2 = 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB'
//                 axios.get(url2,{

//                 })
//                 .then((response) => { 

//                     var respuesta = response.data;
//                     console.log(respuesta);
//                     var fecha2 = respuesta.date;
//                     var Precio2 = respuesta.price;
//                     var unidades2= respuesta.units;
//                     console.log(fecha2);
//                     var Media_dia=[[fecha2,Precio2,unidades2]];

//                     //------------------------------------------------------------------------------------------------//
                
//                     var sql2 = `INSERT INTO Precios_media (fecha,precio,unidades) VALUES ?`;
//                     var sql3 = `SELECT * FROM Precios_media WHERE fecha = "${fecha2}"`;

                    
//                         var conexion = mysql.createConnection({
//                             host:"localhost",
//                             database:"prueba",
//                             user:"admin",
//                             password:"admin2Pass=",
                        
//                         });
//                             /*
//                         var conexion = mysql.createConnection({
//                             host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
//                             database:"b8gyoaad4emvcrwuwtra",
//                             user:"uoxipcxsxq7neldz",
//                             password:"emZVDmwZxUMHrha8bhAL",
                        
//                         });*/

//                         conexion.connect(function(error){
//                             if(error){
//                                     throw error;
//                             }else{
//                                     console.log('CONEXION EXITOSA 2');
//                             }
//                         });

//                         conexion.query(sql3,(error,result)=>{
//                             if (error) throw error;

//                             if ( result.length > 0){
//                                     //console.log(result);
//                                     console.log("si que existe para esta fecha media ");
//                                     //conexion.end();
//                             }else{
//                                     console.log("nuevo dia");
//                                     console.log(Media_dia)
//                                     conexion.query(sql2,[Media_dia],  function (err, result) {
//                                         if (err) throw err;
//                                         console.log("Number of records inserted: " + result.affectedRows);
//                                     });
                                
//                                 }

//                             });
//                             // conexion.end();

//                     })
//                 .catch(err => {
//                     console.log(err);
//                 })
//    //});

   
   




// //--------------------- BBDD ------------------------------------------//

// /*local*/
// var conexion = mysql.createConnection({
//     host:"localhost",
//     database:"prueba",
//     user:"admin",
//     password:"admin2Pass=",

// });

// /*
// var conexion = mysql.createConnection({
//     host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
//     database:"b8gyoaad4emvcrwuwtra",
//     user:"uoxipcxsxq7neldz",
//     password:"emZVDmwZxUMHrha8bhAL",

// });
// */
// /*
// var conectar = function conectarBBDD(){
// conexion.connect(function(error){
//     if(error){
//         throw error;
//     }else{
//         console.log('CONEXION EXITOSA 3');
//     }
// });

// }*/

// //---------------------- End points ------------------------------------//

app.listen(PORT, () => console.log(`run on port ${PORT}`));

app.get('/',(req,res) => {
    res.send('TFG 2022 DIEGO JIMENEZ PRIETO');
    console.log("envio datos")
});

//     //----------- manejo usuarios---------//

//     app.post('/infoUser',(req,res) => {
        
//         const sql = `SELECT * FROM Inicio_sesion `;

        
//         var name = req.body.Usuario;
//         var pass = req.body.Contraseña;

//         console.log(req.body);
//         console.log(name);
//         console.log(pass);

       
//         const sql2 = `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" and Contraseña = "${pass}" `;
//         const sql3 = `SELECT Contraseña FROM Inicio_sesion WHERE Usuario = "${name}"  `;

//         conexion.query(sql3,(error,result)=>{
//             if (result == ""){
//                 res.json('no existe user');
//             }else{
//             console.log(result[0].Contraseña);
//             let compare = bcrypt.compareSync(pass,result[0].Contraseña);

//                 if (compare == true){

//                     let respuesta = {
//                         "token" : "diego",
//                         "respuesta" : "login correcto",
//                         "id" : `${name}`
//                     }


//                     res.json(respuesta)
//                 }else{
//                     res.json('login fallido')
//                 }
//             }
//         });
   

       
//     });

//     app.post('/newUser',async (req,res) => {

        


//         //res.send('newUser');
//         var name = req.body.Usuario;
//         var pass = req.body.Contraseña;
//         var pass_comprobar = req.body.Confirmar_Contraseña;
//         var email = req.body.Email;
//         console.log(req.body);
//         console.log(name);
//         console.log(pass);

//         console.log(pass_comprobar);

//         if (pass == pass_comprobar){
//             var sql2 = `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;
//             var sql = `INSERT INTO Inicio_sesion (Usuario,Contraseña,Email) VALUES ?`;
//             let encryp_pass = await bcrypt.hash(pass,8);
//             console.log("la pass encrypt es :"+encryp_pass);

//             var value_=[[name,encryp_pass,email]];
            
//             conexion.query(sql2,[value_],(error,result)=>{
//                 if (error) throw error;
//                 if ( result.length > 0){
//                     let json={
//                         "respuesta":"ya existe user"
//                     }
//                     res.json(json);
//                 }else{

//                     conexion.query(sql,[value_],(error,result)=>{
//                         if (error) throw error;
//                         console.log("el resultado es : " +result);
//                         let json={
//                             "respuesta":"correcto"
//                         }
//                         res.json(json);
//                     });
                   
//                 }
  
//             });
    
            
//         }else{
//             let json={
//                 "respuesta":"incorrecto"
//             }
//             res.json(json);
//         }
       
//     });


//     app.post('/dataUsuario',(req,res) => {
        
//         var name = req.body.Usuario;
        
//         const sql =  `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;

        
        
//         var pass = req.body.Contraseña;

//         console.log(req.body);
//         console.log(name);
        

       
     

//         conexion.query(sql,(error,result)=>{
//             if (result == ""){
//                 res.json('no existe user');
//             }else{

//                     res.json(result)
                
//             }
//         });
   

       
//     });

//     app.post('/verificarNombres', (req, res) => {
//         const nombres = req.body.nombres;
      
//         const sql = `SELECT Usuario FROM Inicio_sesion WHERE Usuario IN (?)`;
      
//         conexion.query(sql, [nombres], (error, result) => {
//           if (error) {
//             console.error(error);
//             res.status(500).json('Error en la consulta');
//             return;
//           }
      
//           const nombresRegistrados = result.map(row => row.Usuario);
//           const nombresNoRegistrados = nombres.filter(nombre => !nombresRegistrados.includes(nombre));
      
//           if (nombresNoRegistrados.length === 0) {
//             res.json({ registrado: true });
//           } else {
//             res.json({ registrado: false, nombresNoRegistrados });
//           }
//         });
//       });
      




//     app.post('/modificarUser',async (req,res)  => {

        
//         var name = req.body.Usuario
//         var email = req.body.Email
//         var pass = req.body.Contraseña
//         var oldPass = req.body.AntiguaContraseña
//         let encryp_pass = await bcrypt.hash(pass,8);
//         console.log("estamos en modificar user")
//         console.log("email y name es :"+email+name+" "+oldPass)
//         console.log("la pass encrypt es :"+encryp_pass);

//         const sql = `UPDATE Inicio_sesion SET Contraseña = "${encryp_pass}" , Email = "${email}"  WHERE Usuario = "${name}"`
//         const sql1 =  `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;


//         conexion.query(sql1,(error,result)=>{
//             if (result == ""){
//                 res.json('no existe user');
//             }else{
//             console.log(result[0].Contraseña);
//             let compare = bcrypt.compareSync(oldPass,result[0].Contraseña);

//                 if (compare == true){

//                    console.log("misma pass")
                    
//                    conexion.query(sql,(error,result)=>{
//                     if (result == error){
//                         res.json('error update');
//                     }else{
//                         console.log(result)
//                         res.json("actualizado correctamente")
                        
//                     }
//                 });
                
//                 }else{
//                     console.log("contraseñas diferentes")
//                     res.json("contraseñas diferentes")
//                 }
//             }
//         });


        
       
//     });



//     //----------------- precios ----------------------------//

     app.get('/preciosLuzHoras/:fecha',(req,res) => {

        

         const {fecha}=req.params;
        console.log("la fecha es :"+fecha);
        /*
         var proposedDate = fecha + "T22:00:00.000Z";
         console.log(proposedDate);
         var aux = new Date(proposedDate);
         console.log(aux);
        */
         const sql = `SELECT * FROM precios WHERE Fecha_string = "${fecha}"`;

        conexion.query(sql,(error,result)=>{
           if (error) throw error;

           if ( result.length > 0){
                res.json(result);
            }else{
                res.send('no result');
            }
        });
    
      

     });

//     app.get('/preciosLuzMadiaMes',(req,res) => {

       
        
//         const sql = `SELECT * FROM Precios_media `;
//         conexion.query(sql,(error,result)=>{
//             if (error) throw error;
 
//             if ( result.length > 0){
//                 res.json(result);
//             }else{
//                 res.send('no result');
//             }
//         });
     
            
//     });

//     app.post('/anadirGasto',(req,res) => {

        

//     var user = req.body.Usuario;
//     var name = req.body.Nombre;
//     var gasto = req.body.Gasto;
//     var consumo = req.body.Consumo;
//     var TipoDato = "LUZ" 
//     console.log("nombre es:  ");

//     console.log(user);
       
//     var sql = `INSERT INTO Gastos_Usuario (Usuario,Nombre,Gasto,Consumo,TipoDato) VALUES ?`;
//     var value_=[[user,name,gasto,consumo,TipoDato]];
    
//     conexion.query(sql,[value_],(error,result)=>{
        
//         if (error) throw error;
//         console.log("el resultado es : " +result);
//         let json={
//             "respuesta":"correcto"
//         }
//         res.json(json);
//     });
       
//     });


//     app.get('/gastosPersonales/:user',(req,res) => {
        
       


//         const {user}=req.params;
//         console.log("user es :"+user);
//         const sql = `SELECT * FROM Gastos_Usuario WHERE Usuario = "${user}"`;
//         conexion.query(sql,(error,result)=>{
//             if (error) throw error;
 
//             if ( result.length > 0){
//                 res.json(result);
//             }else{
//                 res.send('no result');
//             }
//         });
     
            
//     });


//     app.post('/borrarGasto',(req,res) => {

//         var user = req.body.Usuario;
//         var name = req.body.Nombre;
//         var gasto = req.body.Gasto;
//         var consumo = req.body.Consumo;
    
//         console.log("nombre es:  ");
    
//         console.log(user);
//         console.log("LOS DATOS QUE LLEGAN SON");
//         console.log("name :",name);
//         console.log("gasto :",gasto);  
//         var sql = `DELETE FROM Gastos_Usuario WHERE Usuario = "${user}" AND Nombre = "${name}" `;
      
        
//         conexion.query(sql,(error,result)=>{
            
//             if (error) throw error;
//             console.log("el resultado es : " +result);
//             let json={
//                 "respuesta":"correcto"
//             }
//             res.json(json);
//         });
    
//         });


//         app.post('/CalcularGastoGasolina',(req,res) => {
           
//             let datos = req.body;
//         var precioTotal;
//         let precioHora;

//         if ( datos != null){
//             console.log(datos)
//             console.log("kilometros :" +req.body.kilometros + "consumo"+req.body.Consumo+"precioslitros :"+req.body.precioslitro )

//             var kilometros = req.body.kilometros;
//             var consumo = req.body.Consumo;
//             var precioslitro = req.body.precioslitro;
            
//             console.log("datos bien enviados");
            
//             var litrosTotal = (kilometros * consumo) /100
//             var preciototal = litrosTotal * precioslitro
//             console.log(preciototal)

//             let json={
//                 "precio": preciototal
//             }
               
//             res.json(json)

            
//         }else{
//             res.send('datos error');
//             console.log("datos error");
//         }
            
         
                
//         });





//         app.post('/gastosCarburante/:fecha',(req,res) => {

//             const {fecha}=req.params;
//             var user = req.body.Usuario;
//             var name = req.body.Nombre;
//             var gasto = req.body.Gasto;
//             var consumo = req.body.Consumo;
//             var TipoDato = "CARBURANTE" 

//             var sql = `INSERT INTO Gastos_Usuario (Usuario,Nombre,Gasto,Consumo,TipoDato) VALUES ?`;
//             var value_=[[user,name,gasto,consumo,TipoDato]];
            
//             conexion.query(sql,[value_],(error,result)=>{
                
//                 if (error) throw error;
//                 console.log("el resultado es : " +result);
//                 let json={
//                     "respuesta":"correcto"
//                 }
//                 res.json(json);
//             });
         
                
//         });


//     //----------------- Datos usuario -------------------//

//     app.post('/precioUso/:fecha',(req,res) => {
//         //res.send('precio uso');
//         let datos = req.body;
//         var precioTotal;
//         let precioHora;

//         if ( datos != null){
            
//             const {fecha}=req.params;
//             console.log(fecha);
//             console.log("datos bien enviados");
//             console.log(datos);
//             //console.log(datos.datosPrecio);
//             //
//             console.log(datos.Consumo);
//             //consulta  ala bbdd precio de luz de ese dia de la hora en adelanete

//             const sql = `SELECT * FROM precios WHERE Fecha_string = "${fecha}" and Hora = "${datos.Hora_inicio}" `;

//             conexion.query(sql,(error,result)=>{
//                 if (error) throw error;
     
//                 if ( result.length > 0){
//                     console.log(result[0].precio);
//                     precioHora = result[0].precio / 1000;
//                     console.log("precio hora es :"+precioHora);
//                     console.log(datos.Consumo);
//                     precioTotal = precioHora * datos.Consumo;
//                     console.log("precio total es :"+precioTotal);
//                     let json = {
//                         "precio" : precioTotal
//                     }
//                     console.log(json);
//                      res.json(json);


//                 }else{
//                     console.log('no result');
//                     let fallo = "fallo"
//                     let json={
//                         "respuesta":fallo
//                     }
//                     res.json(json)
//                 }
//             });

           
            
//         }else{
//             res.send('datos error');
//             console.log("datos error");
//         }
//     });


//     /*-----------------------------------------*/

//     app.post('/GastoConjunto', (req, res) => {
//         // Obtener el último ID_group insertado
//         const query = "SELECT MAX(ID_group) as max_id FROM Gasto_Conjunto"
//         conexion.query(query, (error, results) => {
//           if (error) throw error;
//           const maxId = results[0].max_id;
//           const newId = maxId + 1;
      
//           // Asignar el nuevo ID_group y otras variables
//           var ID_group = newId;
//           var Name = req.body.Name;
//           var ID_user = req.body.ID_user;
//           var Fecha_creacion = req.body.Fecha_creacion;
//           var Description = req.body.Description;
//           var Gasto_total = req.body.Gasto_total;
//           var Moneda = req.body.Moneda;
//           var Estado = req.body.Estado;
//           var Fecha_cierre = req.body.Fecha_cierre;
//           var Fecha_eliminacion = req.body.Fecha_eliminacion;
      
//           console.log("valor json")
//           console.log(req.body)
//           var sql_aux = `INSERT INTO Gasto_Conjunto(ID_group, Name, ID_user, Fecha_creacion, Description, Gasto_total, Moneda, Estado, Fecha_cierre, Fecha_eliminacion) 
//             VALUES ("${ID_group}", "${Name}", "${ID_user}", "${Fecha_creacion}", "${Description}", "${Gasto_total}", "${Moneda}", "${Estado}", "${Fecha_cierre}", "${Fecha_eliminacion}")`;
      
//           conexion.query(sql_aux, (error, result) => {
//             if (error) throw error;
//             console.log("el resultado es : " + result);
            
            
//             // Insertar usuarios en la tabla Gasto_Conjunto_Master
//             const Users = req.body.Users;
//             if (Users && Users.length) {
//                 for (let i = 0; i < Users.length; i++) {
//                     const ID_user = Users[i];
//                     const Contribucion = Gasto_total / Users.length ;
//                     const Email = "test@gmail.com";
//                     const Fecha_Union = Fecha_creacion;
//                     const sql_query = `INSERT INTO Gasto_Conjunto_Master(ID_user, ID_group, User, Email, Fecha_Union, Contribucion) 
//                                     VALUES ('${ID_user}', '${newId}', '${ID_user}', '${Email}', '${Fecha_Union}', '${Contribucion}')`;
//                     conexion.query(sql_query, (error, result) => {
//                         if (error) throw error;
//                         console.log("el resultado es : " + result);

//                                  // Suponiendo que tienes una conexión llamada "conexion" ya establecida con la base de datos.

//                         // Datos de ejemplo para el nuevo registro de notificación
    
//                         const Tipo = 'GASTO_COMPARTIDO'; // Tipo de notificación (puedes cambiar 'tipo_notificacion' por el valor real que corresponda)
//                         const Info = `test contribucion : ${Contribucion}`; // Contenido o información de la notificación
//                         const Fecha_Union = new Date().toISOString(); // Fecha de unión o creación de la notificación (puedes ajustar la fecha según tus necesidades)
//                         const Estado = 'activo'; // Estado de la notificación (puedes cambiar 'activo' por el valor real que corresponda)
//                         const ID_noti = 01
//                         // Query para realizar el INSERT
//                         const insertQuery = `INSERT INTO Notificaciones( ID_user, Tipo, Info, Fecha_Union, Estado) 
//                                             VALUES ('${ID_user}', '${Tipo}', '${Info}', '${Fecha_Union}', '${Estado}')`;

//                         conexion.query(insertQuery, (error, result) => {
//                         if (error) throw error;
//                         console.log("El resultado es: ", result); 
//                         });
//                     });
//                 }
//                 res.send("añadido con exito")
//             }
//           });
          

//         });


//       });


//     app.get('/GastoConjunto/:ID_group', (req, res) => {
//         const ID_group = req.params.ID_group;
//         const sql_query = `SELECT * FROM Gasto_Conjunto WHERE ID_group = '${ID_group}'`;
//         conexion.query(sql_query, (error, result) => {
//           if (error) throw error;
//           console.log("el resultado es : " + result);
//           res.json(result);
//         });
//       });


     
     
     
     
//       app.post('/GastoConjuntoMaster', (req, res) => {
//         const { ID_user, ID_group, User, Email, Fecha_Union, Contribucion } = req.body;
        
//         // Consulta para obtener el Gasto_total para el ID_group dado
//         const gastoTotalQuery = `SELECT Gasto_total FROM Gasto_Conjunto WHERE ID_group = '${ID_group}'`;
//         conexion.query(gastoTotalQuery, (error, result) => {
//           if (error) throw error;
//           const gastoTotal = result[0].Gasto_total;
//           console.log("Gasto total es: "+gastoTotal)
//           // Consulta para obtener todos los ID_user para el ID_group dado
//           const idUserQuery = `SELECT ID_user FROM Gasto_Conjunto_Master WHERE ID_group = '${ID_group}'`;
//           conexion.query(idUserQuery, (error, result) => {
//             if (error) throw error;
//             const usuarios = result;
//             const numeroUsuarios = usuarios.length + 1;
//             const nuevaContribucion = gastoTotal / numeroUsuarios;
//             console.log("usarios es :"+usuarios)
//             console.log("Nueva contribucion es : "+nuevaContribucion)
//             // Actualizar la columna Contribucion en Gasto_Conjunto_Master para los usuarios con ID_user obtenidos anteriormente
//             const idUsuarios = usuarios.map(u => u.ID_user);
//             console.log("idUsuarios : "+idUsuarios)
//             const placeholders = idUsuarios.map(() => '?,').join('').slice(0, -1);
// console.log("placeholders: " + placeholders);
// const updateQuery = `UPDATE Gasto_Conjunto_Master SET Contribucion = ${nuevaContribucion} WHERE ID_user IN (${placeholders})`;

// const params = idUsuarios;

//             conexion.query(updateQuery,params,(error, result) => {
//               if (error) throw error;
              
//               // Insertar los datos actuales en Gasto_Conjunto_Master con el valor de Contribucion igual a nuevaContribucion
//               const insertQuery = `INSERT INTO Gasto_Conjunto_Master(ID_user, ID_group, User, Email, Fecha_Union, Contribucion) 
//                                    VALUES ('${ID_user}', '${ID_group}', '${User}', '${Email}', '${Fecha_Union}', '${nuevaContribucion}')`;
//               conexion.query(insertQuery, (error, result) => {
//                 if (error) throw error;
//                 console.log("el resultado es : " + result);

               


//                 let json = {
//                   "respuesta": "correcto"
//                 };
//                 res.json(json);
//               });
//             });
//           });
//         });
//       });
      

//       app.delete('/DeleteGastoConjuntoMaster', (req, res) => {
//         const { ID_user, ID_group, Contribucion } = req.body;
      
//         const sql = `DELETE FROM Gasto_Conjunto_Master WHERE ID_user = ${ID_user} AND ID_group = '${ID_group}' AND Contribucion = ${Contribucion}`;
      
//         conexion.query(sql, (error, result) => {
//           if (error) throw error;
//           console.log("el resultado es: " + result);
//           let json = {
//             "respuesta": "correcto"
//           }
//           res.json(json);
//         });
//       });

//       app.get('/gastosInfo/:id_user', (req, res) => {
//         const id_user = req.params.id_user;
      
//         // Consulta para obtener los registros correspondientes al ID de usuario especificado
//         const sql = `SELECT * FROM Gasto_Conjunto_Master WHERE ID_user = ?`;
      
//         conexion.query(sql, [id_user], (err, result) => {
//           if (err) throw err;
//           console.log(`Se encontraron ${result.length} registros para el usuario ${id_user}`);
      
//           // Devolver los registros en la respuesta HTTP como un objeto JSON
//           res.json(result);
//         });
//       });

//       app.get('/gastosInfoUsers/:id_group', (req, res) => {
//         const id_group = req.params.id_group;
    
//         // Consulta para obtener los registros correspondientes al ID de grupo especificado
//         const sql = `SELECT * FROM Gasto_Conjunto_Master WHERE ID_group = ?`;
    
//         conexion.query(sql, [id_group], (err, result) => {
//             if (err) throw err;
//             console.log(`Se encontraron ${result.length} registros para el grupo ${id_group}`);
    
//             // Devolver los registros en la respuesta HTTP como un objeto JSON
//             res.json(result);
//         });
//     });


      

//       app.get('/gastos/:id_user', (req, res) => {
//         const id_user = req.params.id_user;
      
//         // Consulta para obtener los ID_group correspondientes al ID de usuario especificado
//         const sql = `SELECT ID_group FROM Gasto_Conjunto_Master WHERE ID_user = ?`;
      
//         conexion.query(sql, [id_user], (err, result) => {
//           if (err) throw err;
      
//           const id_groups = result.map(row => row.ID_group);
//             const resultados = [];

//             let totalGroups = id_groups.length;
//             console.log("tamaño de totalGropus es: "+totalGroups)

//                 id_groups.forEach((ID_group) => {
//                 const sql_query = `SELECT * FROM Gasto_Conjunto WHERE ID_group = '${ID_group}' AND (Estado = 'ACTIVO' OR Estado = 'PAGADO')`;
//                 conexion.query(sql_query, (err, result) => {
//                     if (err) throw err;
//                     console.log(`Se encontraron ${result.length} registros para el grupo ${ID_group}`);
//                     if (result.length > 0) {
//                         console.log("resultado no vacio ")
//                     resultados.push(result);
//                     } else {
//                     totalGroups--; // Restar 1 al tamaño inicial si result es vacío
//                     console.log("resultado vacio ")
//                     }
//                     if (resultados.length === totalGroups) {
//                     // Cuando se hayan obtenido todos los resultados, devolverlos en la respuesta HTTP como un objeto JSON
//                     res.json(resultados);
//                     return; // Salir del bucle
//                     }
//                 });
//                 });
              

         
//         });
//       });


//       app.get('/gastosUser/:id_user', (req, res) => {
//         const id_user = req.params.id_user;
      
//         // Consulta para obtener los ID_group correspondientes al ID de usuario especificado
//         const sql = `SELECT ID_group FROM Gasto_Conjunto_Master WHERE ID_user = ?`;
      
//         conexion.query(sql, [id_user], (err, result) => {
//           if (err) throw err;
      
//           const id_groups = result.map(row => row.ID_group);
//             const resultados = [];

//             id_groups.forEach((ID_group) => {
//             const sql_query = `SELECT * FROM Gasto_Conjunto_Master WHERE ID_group = '${ID_group}'`;
//             conexion.query(sql_query, (err, result) => {
//                 if (err) throw err;
//                 console.log(`Se encontraron ${result.length} registros para el grupo ${ID_group}`);
//                 resultados.push(result);
//                 if (resultados.length === id_groups.length) {
//                 // Cuando se hayan obtenido todos los resultados, devolverlos en la respuesta HTTP como un objeto JSON
//                 res.json(resultados);
//                 }
//             });
//             });

         
//         });
//       });

//       app.put('/actualizarEstado/:ID_group', (req, res) => {
//         const ID_group = req.params.ID_group;
//         const sql_query = `UPDATE Gasto_Conjunto SET Estado = 'ELIMINADO' WHERE ID_group = '${ID_group}'`;
//         conexion.query(sql_query, (err, result) => {
//           if (err) throw err;
//           console.log(`Se actualizó el estado a 'ELIMINADO' para el grupo ${ID_group}`);
//           res.sendStatus(200);
//         });
//       });


//       app.put('/actualizarPagado', (req, res) => {
//         const { nombres, ID_group } = req.body;
      
//         // Consulta para actualizar la columna "PAGADO" para los nombres y el ID_group especificados
//         const sql = `UPDATE Gasto_Conjunto_Master SET PAGADO = 'SI' WHERE ID_user IN (?) AND ID_group = ?`;
      
//         const values = [nombres, ID_group];
      
//         conexion.query(sql, values, (err, result) => {
//           if (err) throw err;
//           console.log(`Se actualizaron ${result.affectedRows} registros`);
      
//           // Devolver una respuesta indicando el número de registros actualizados
//           res.send(`Se actualizaron ${result.affectedRows} registros`);
//         });
//       });

//       app.put('/actualizarPagadoNO', (req, res) => {
//         const { nombres, ID_group } = req.body;
      
//         // Consulta para actualizar la columna "PAGADO" a 'NO' para los nombres y el ID_group especificados
//         const sql = `UPDATE Gasto_Conjunto_Master SET PAGADO = 'NO' WHERE ID_user IN (?) AND ID_group = ?`;
      
//         const values = [nombres, ID_group];
      
//         conexion.query(sql, values, (err, result) => {
//           if (err) throw err;
//           console.log(`Se actualizaron ${result.affectedRows} registros a NO`);
      
//           // Devolver una respuesta indicando el número de registros actualizados
//           res.send(`Se actualizaron ${result.affectedRows} registros a NO`);
//         });
//       });
      
//     //   app.get('/Notificaciones', (req, res) => {
//     //     const { ID_user } = req.body;
//     //     const selectQuery = `SELECT * FROM Notificaciones WHERE ID_user = '${ID_user}'`;
//     //     console.log("notificaciones : ")
//     //     console.log(ID_user)
//     //     console.log(req.body)
//     // conexion.query(selectQuery, (error, results) => {
//     //     if (error) {
//     //         res.send(error);
//     //     } else {
//     //         // Convierte el resultado en un JSON
//     //         console.log(results)
//     //         const jsonResult = JSON.stringify(results);
//     //         res.send(jsonResult);
//     //     }
//     //   });
      
//     // }) 

//     app.get('/Notificaciones/:ID_user', (req, res) => {
//         const ID_user = req.params.ID_user;
//         const selectQuery = `SELECT * FROM Notificaciones WHERE ID_user = '${ID_user}'`;
//         console.log("notificaciones : ")
//         console.log(ID_user)
//         console.log(req.body)
//     conexion.query(selectQuery, (error, results) => {
//         if (error) {
//             res.send(error);
//         } else {
//             // Convierte el resultado en un JSON
//             console.log(results)
//             const jsonResult = JSON.stringify(results);
//             res.send(jsonResult);
//         }
//       });
      
//     }) 
      
      

//       app.post('/verificarPago', (req, res) => {
//         const { id_user, ID_group } = req.body;
      
//         // Consulta para verificar el estado de pago para el ID de usuario y el ID de grupo especificados
//         const sql = `SELECT PAGADO FROM Gasto_Conjunto_Master WHERE ID_user = ? AND ID_group = ?`;
      
//         conexion.query(sql, [id_user, ID_group], (err, result) => {
//           if (err) throw err;
      
//           if (result.length > 0) {
//             // Se encontraron registros para el usuario y el grupo especificados
//             const pagado = result[0].PAGADO === 'SI';
//             res.send(pagado ? 'SI' : 'NO');
//           } else {
//             // No se encontraron r10egistros para el usuario y el grupo especificados
//             res.send('NO');
//           }
//         });
//       });


//       app.get('/obtenerUsuariosPagados', (req, res) => {
//         const { ID_group } = req.query;
      
//         // Consulta para obtener las columnas "ID_user", "PAGADO" y "Contribucion" de las filas con el ID_group especificado
//         const sql = `SELECT ID_user, PAGADO, Contribucion FROM Gasto_Conjunto_Master WHERE ID_group = ?`;
      
//         const values = [ID_group];
      
//         conexion.query(sql, values, (err, result) => {
//           if (err) throw err;
      
//           const usuariosPagados = result.map(row => {
//             return {
//               ID_group: ID_group,  
//               ID_user: row.ID_user,
//               PAGADO: row.PAGADO,
//               Contribucion: row.Contribucion || "" // Añadir la columna "Contribucion" al retorno con su valor devuelto
//             };
//           });
      
//           // Devolver una respuesta con las columnas "ID_user", "PAGADO" y "Contribucion"
//           res.json(usuariosPagados);
//         });
//       });


//       app.post('/insertarLimite', (req, res) => {
//         const { id_user, limite, tipo } = req.body;
      
//         const insertQuery = 'INSERT INTO Limite_gasto (id_user, limite, tipo) VALUES (?,  ?, ?)';
//         const values = [id_user, limite, tipo];
      
//         conexion.query(insertQuery, values, (error, results) => {
//           if (error) {
//             console.error('Error al insertar en la base de datos:', error);
//             res.status(500).json({ error: 'Error al insertar en la base de datos' });
//           } else {
//             console.log('Inserción exitosa en la base de datos');
//             res.status(200).json({ message: 'Inserción exitosa en la base de datos' });
//           }
//         });
//       });


//       app.get('/obtenerLimite', (req, res) => {
//         const { nombre_usuario } = req.query;
        
//         const selectQueryLuz = `
//             SELECT limite
//             FROM Limite_gasto
//             WHERE ID_user = ?
//               AND tipo = 'LUZ'
//             ORDER BY fecha DESC
//             LIMIT 1;
//         `;
    
//         const selectQueryGasolina = `
//             SELECT limite
//             FROM Limite_gasto
//             WHERE ID_user = ?
//               AND tipo = 'GASOLINA'
//             ORDER BY fecha DESC
//             LIMIT 1;
//         `;
    
//         const response = {};
    
//         conexion.query(selectQueryLuz, [nombre_usuario], (errorLuz, resultsLuz) => {
//             if (errorLuz) {
//                 console.error('Error al obtener el límite de LUZ:', errorLuz);
//                 res.status(500).json({ error: 'Error al obtener el límite de LUZ' });
//             } else {
//                 if (resultsLuz.length > 0) {
//                     response.luz = resultsLuz[0].limite;
//                 }
    
//                 conexion.query(selectQueryGasolina, [nombre_usuario], (errorGasolina, resultsGasolina) => {
//                     if (errorGasolina) {
//                         console.error('Error al obtener el límite de GASOLINA:', errorGasolina);
//                         res.status(500).json({ error: 'Error al obtener el límite de GASOLINA' });
//                     } else {
//                         if (resultsGasolina.length > 0) {
//                             response.gasolina = resultsGasolina[0].limite;
//                         }
    
//                         if (Object.keys(response).length > 0) {
//                             res.status(200).json(response);
//                         } else {
//                             res.status(404).json({ message: 'Límites no encontrados para el usuario especificado' });
//                         }
//                     }
//                 });
//             }
//         });
//     });
    
    




//       var userTest = "pepito"
//       const sql = `SELECT * FROM Gastos_Usuario WHERE Usuario = "${userTest}"`;
//     //const sql = `SELECT * FROM Gastos_Usuario WHERE Usuario = pepito`;
//         conexion.query(sql,(error,result)=>{
//             if (error) throw error;
 
//             if ( result.length > 0){
//                 generarPDF("pepito",result)
//                     .then((fileName) => {
//                         console.log(`PDF generado: ${fileName}`);
//                         // Aquí puedes realizar otras acciones con el archivo generado, como enviarlo al cliente o almacenarlo en alguna ubicación específica.
//                     })
//                     .catch((error) => {
//                         console.error('Error al generar el PDF:', error);
//                     });
//             }else{
//                 Console.log('no result');
//             }
//         });


      

//    function generarPDF(user, gastos) {
//         const doc = new pdfkit();
//         const fileName = path.join('/home/diego/', 'pdf', `gastos_${user}_${new Date().toISOString()}.pdf`);
//         const stream = fs.createWriteStream(fileName);
      
//         doc.pipe(stream);
//         doc.fontSize(18).text(`Reporte de Gastos para el Usuario ${user}`, { align: 'center' });
//         doc.fontSize(14).text('Detalles de gastos:', { underline: true });
      
//         gastos.forEach((gasto) => {
//           doc.text(`ID: ${gasto.Usuario}, Nombre: ${gasto.Nombre}, Cantidad: $${gasto.Gasto}`);
//         });
//         //doc.text(`ID: ${gastos}, Descripción: ${gastos}, Cantidad: $${user}`);
      
//         doc.end();
      
//         return new Promise((resolve, reject) => {
//           stream.on('finish', () => resolve(fileName));
//           stream.on('error', reject);
//         });
//       }


     

      





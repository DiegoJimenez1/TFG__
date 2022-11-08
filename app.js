const axios = require('axios').default;
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const bcrypt = require('bcryptjs');
const cron = require('node-cron')

var jwt = require("jwt-simple");
var moment = require("moment");
var config = require("./config");


var precio,hora,unidades,fecha;

const app = express();
app.use(bodyParser.json());

app.use(cors()) 



//cron.schedule(' 0 21 * * *', () =>{
   //----------------------------------leer datos api -------------------------------------------//

    console.log("******************************************* la hora actual es *******************************************************")
    // crea un nuevo objeto `Date`
    var today = new Date();
 
    // obtener la fecha y la hora
    var now = today.toLocaleString();
    console.log(now);

   let url = 'https://api.preciodelaluz.org/v1/prices/all?zone=PCB'
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
               var conexion = mysql.createConnection({
                   host:"localhost",
                   database:"prueba",
                   user:"admin",
                   password:"admin2Pass=",
               
               });
               /*
               var conexion = mysql.createConnection({
                   host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
                   database:"b8gyoaad4emvcrwuwtra",
                   user:"uoxipcxsxq7neldz",
                   password:"emZVDmwZxUMHrha8bhAL",
               
               });*/

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

   //--------------------------------------------------------------------------------------------//
   //--------------------------------------------------------------------------------------------//

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

       
           var conexion = mysql.createConnection({
               host:"localhost",
               database:"prueba",
               user:"admin",
               password:"admin2Pass=",
           
           });
               /*
           var conexion = mysql.createConnection({
               host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
               database:"b8gyoaad4emvcrwuwtra",
               user:"uoxipcxsxq7neldz",
               password:"emZVDmwZxUMHrha8bhAL",
           
           });*/

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
//});



//--------------------- BBDD ------------------------------------------//

/*local*/
var conexion = mysql.createConnection({
    host:"localhost",
    database:"prueba",
    user:"admin",
    password:"admin2Pass=",

});

/*
var conexion = mysql.createConnection({
    host:"b8gyoaad4emvcrwuwtra-mysql.services.clever-cloud.com",
    database:"b8gyoaad4emvcrwuwtra",
    user:"uoxipcxsxq7neldz",
    password:"emZVDmwZxUMHrha8bhAL",

});
*/
/*
var conectar = function conectarBBDD(){
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('CONEXION EXITOSA 3');
    }
});

}*/

//---------------------- End points ------------------------------------//

app.listen(PORT, () => console.log(`run on port ${PORT}`));

app.get('/',(req,res) => {
    res.send('TFG 2022 DIEGO JIMENEZ PRIETO');
});

    //----------- manejo usuarios---------//

    app.post('/infoUser',(req,res) => {
        
        const sql = `SELECT * FROM Inicio_sesion `;

        
        var name = req.body.Usuario;
        var pass = req.body.Contraseña;

        console.log(req.body);
        console.log(name);
        console.log(pass);

       
        const sql2 = `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" and Contraseña = "${pass}" `;
        const sql3 = `SELECT Contraseña FROM Inicio_sesion WHERE Usuario = "${name}"  `;

        conexion.query(sql3,(error,result)=>{
            if (result == ""){
                res.json('no existe user');
            }else{
            console.log(result[0].Contraseña);
            let compare = bcrypt.compareSync(pass,result[0].Contraseña);

                if (compare == true){

                    let respuesta = {
                        "token" : "diego",
                        "respuesta" : "login correcto",
                        "id" : `${name}`
                    }


                    res.json(respuesta)
                }else{
                    res.json('login fallido')
                }
            }
        });
   

       
    });

    app.post('/newUser',async (req,res) => {

        


        //res.send('newUser');
        var name = req.body.Usuario;
        var pass = req.body.Contraseña;
        var pass_comprobar = req.body.Confirmar_Contraseña;
        var email = req.body.Email;
        console.log(req.body);
        console.log(name);
        console.log(pass);

        console.log(pass_comprobar);

        if (pass == pass_comprobar){
            var sql2 = `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;
            var sql = `INSERT INTO Inicio_sesion (Usuario,Contraseña,Email) VALUES ?`;
            let encryp_pass = await bcrypt.hash(pass,8);
            console.log("la pass encrypt es :"+encryp_pass);

            var value_=[[name,encryp_pass,email]];
            
            conexion.query(sql2,[value_],(error,result)=>{
                if (error) throw error;
                if ( result.length > 0){
                    let json={
                        "respuesta":"ya existe user"
                    }
                    res.json(json);
                }else{

                    conexion.query(sql,[value_],(error,result)=>{
                        if (error) throw error;
                        console.log("el resultado es : " +result);
                        let json={
                            "respuesta":"correcto"
                        }
                        res.json(json);
                    });
                   
                }
  
            });
    
            
        }else{
            let json={
                "respuesta":"incorrecto"
            }
            res.json(json);
        }
       
    });


    app.post('/dataUsuario',(req,res) => {
        
        var name = req.body.Usuario;
        
        const sql =  `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;

        
        
        var pass = req.body.Contraseña;

        console.log(req.body);
        console.log(name);
        

       
     

        conexion.query(sql,(error,result)=>{
            if (result == ""){
                res.json('no existe user');
            }else{

                    res.json(result)
                
            }
        });
   

       
    });




    app.post('/modificarUser',async (req,res)  => {

        
        var name = req.body.Usuario
        var email = req.body.Email
        var pass = req.body.Contraseña
        var oldPass = req.body.AntiguaContraseña
        let encryp_pass = await bcrypt.hash(pass,8);
        console.log("estamos en modificar user")
        console.log("email y name es :"+email+name+" "+oldPass)
        console.log("la pass encrypt es :"+encryp_pass);

        const sql = `UPDATE Inicio_sesion SET Contraseña = "${encryp_pass}" , Email = "${email}"  WHERE Usuario = "${name}"`
        const sql1 =  `SELECT * FROM Inicio_sesion WHERE Usuario = "${name}" `;


        conexion.query(sql1,(error,result)=>{
            if (result == ""){
                res.json('no existe user');
            }else{
            console.log(result[0].Contraseña);
            let compare = bcrypt.compareSync(oldPass,result[0].Contraseña);

                if (compare == true){

                   console.log("misma pass")
                    
                   conexion.query(sql,(error,result)=>{
                    if (result == error){
                        res.json('error update');
                    }else{
                        console.log(result)
                        res.json("actualizado correctamente")
                        
                    }
                });
                
                }else{
                    console.log("contraseñas diferentes")
                    res.json("contraseñas diferentes")
                }
            }
        });


        
       
    });



    //----------------- precios ----------------------------//

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

    app.get('/preciosLuzMadiaMes',(req,res) => {

       
        
        const sql = `SELECT * FROM Precios_media `;
        conexion.query(sql,(error,result)=>{
            if (error) throw error;
 
            if ( result.length > 0){
                res.json(result);
            }else{
                res.send('no result');
            }
        });
     
            
    });

    app.post('/anadirGasto',(req,res) => {

        

    var user = req.body.Usuario;
    var name = req.body.Nombre;
    var gasto = req.body.Gasto;
    var consumo = req.body.Consumo;

    console.log("nombre es:  ");

    console.log(user);
       
    var sql = `INSERT INTO Gastos_Usuario (Usuario,Nombre,Gasto,Consumo) VALUES ?`;
    var value_=[[user,name,gasto,consumo]];
    
    conexion.query(sql,[value_],(error,result)=>{
        
        if (error) throw error;
        console.log("el resultado es : " +result);
        let json={
            "respuesta":"correcto"
        }
        res.json(json);
    });
       
    });


    app.get('/gastosPersonales/:user',(req,res) => {
        
       


        const {user}=req.params;
        console.log("user es :"+user);
        const sql = `SELECT * FROM Gastos_Usuario WHERE Usuario = "${user}"`;
        conexion.query(sql,(error,result)=>{
            if (error) throw error;
 
            if ( result.length > 0){
                res.json(result);
            }else{
                res.send('no result');
            }
        });
     
            
    });


    app.post('/borrarGasto',(req,res) => {

        var user = req.body.Usuario;
        var name = req.body.Nombre;
        var gasto = req.body.Gasto;
        var consumo = req.body.Consumo;
    
        console.log("nombre es:  ");
    
        console.log(user);
        console.log("LOS DATOS QUE LLEGAN SON");
        console.log("name :",name);
        console.log("gasto :",gasto);  
        var sql = `DELETE FROM Gastos_Usuario WHERE Usuario = "${user}" AND Nombre = "${name}" `;
      
        
        conexion.query(sql,(error,result)=>{
            
            if (error) throw error;
            console.log("el resultado es : " +result);
            let json={
                "respuesta":"correcto"
            }
            res.json(json);
        });
    
        });


    //----------------- Datos usuario -------------------//

    app.post('/precioUso/:fecha',(req,res) => {
        //res.send('precio uso');
        let datos = req.body;
        var precioTotal;
        let precioHora;

        if ( datos != null){
            
            const {fecha}=req.params;
            console.log(fecha);
            console.log("datos bien enviados");
            console.log(datos);
            //console.log(datos.datosPrecio);
            //
            console.log(datos.Consumo);
            //consulta  ala bbdd precio de luz de ese dia de la hora en adelanete

            const sql = `SELECT * FROM precios WHERE Fecha_string = "${fecha}" and Hora = "${datos.Hora_inicio}" `;

            conexion.query(sql,(error,result)=>{
                if (error) throw error;
     
                if ( result.length > 0){
                    console.log(result[0].precio);
                    precioHora = result[0].precio / 1000;
                    console.log("precio hora es :"+precioHora);
                    console.log(datos.Consumo);
                    precioTotal = precioHora * datos.Consumo;
                    console.log("precio total es :"+precioTotal);
                    let json = {
                        "precio" : precioTotal
                    }
                    console.log(json);
                     res.json(json);


                }else{
                    console.log('no result');
                    let fallo = "fallo"
                    let json={
                        "respuesta":fallo
                    }
                    res.json(json)
                }
            });

           
            
        }else{
            res.send('datos error');
            console.log("datos error");
        }
    });






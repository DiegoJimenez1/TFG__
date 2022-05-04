const axios = require('axios').default;
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');



var precio,hora,unidades,fecha;

const app = express();
app.use(bodyParser.json());
app.use(cors()) 


//----------------------------------leer datos api -------------------------------------------//

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

                var conexion = mysql.createConnection({
                    host:"localhost",
                    database:"prueba",
                    user:"admin",
                    password:"admin2Pass=",
                
                });

                conexion.connect(function(error){
                    if(error){
                        throw error;
                    }else{
                        console.log('CONEXION EXITOSA');
                    }
                });
           
            conexion.query(sql_,(error,result)=>{
                if (error) throw error;

                if ( result.length > 0){
                    //console.log(result);
                    console.log("si que existe");
                    conexion.end();
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
                  conexion.end(); 
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

            conexion.connect(function(error){
                if(error){
                        throw error;
                }else{
                        console.log('CONEXION EXITOSA');
                }
            });

            conexion.query(sql3,(error,result)=>{
                if (error) throw error;

                if ( result.length > 0){
                        //console.log(result);
                        console.log("si que existe para esta fecha");
                        conexion.end();
                }else{
                        console.log("nuevo dia");
                        
                        conexion.query(sql2,[Media_dia],  function (err, result) {
                            if (err) throw err;
                            console.log("Number of records inserted: " + result.affectedRows);
                        });
                    
                    }

                });

        })
    .catch(err => {
        console.log(err);
    })


//--------------------- BBDD ------------------------------------------//

var conexion = mysql.createConnection({
    host:"localhost",
    database:"prueba",
    user:"admin",
    password:"admin2Pass=",

});

var conectar = function conectarBBDD(){
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('CONEXION EXITOSA');
    }
});

}

//---------------------- End points ------------------------------------//

app.listen(PORT, () => console.log(`run on port ${PORT}`));

app.get('/',(req,res) => {
    res.send('welcome to my api');
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

       conexion.query(sql2,(error,result)=>{
           if (error) throw error;

           if ( result.length > 0){
               res.json(result);
               console.log("existe el user");
           }else{
               res.send('contraseña o usuario erroneo');
               console.log("no existe el user");
           }
       });
    });

    app.post('/newUser',(req,res) => {
        res.send('newUser');
    });

    app.post('/modificarUser',(req,res) => {
        res.send('modificarUser');
    });



    //----------------- precios ----------------------------//

    app.get('/preciosLuzHoras/:fecha',(req,res) => {

        const {fecha}=req.params;
        console.log(fecha);
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
        res.send('precios luz Mes');
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
            //console.log(datos.datosPrecio.Consumo);
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
                }
            });

           
            
        }else{
            res.send('datos error');
            console.log("datos error");
        }
    });






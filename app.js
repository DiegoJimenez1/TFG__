const axios = require('axios').default;
var mysql = require('mysql');
const PORT = process.env.PORT || 3050;
const express = require('express');
const bodyParser = require('body-parser');

var precio,hora,unidades,fecha;

const app = express();
app.use(bodyParser.json());



//----------------------------------leer datos api -------------------------------------------//

let url = 'https://api.preciodelaluz.org/v1/prices/all?zone=PCB'
axios.get(url,{

})
.then((response) => {
    //console.log(response);
    
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
  

   let aux = Object.values(response.data);

   var values_precio = [];
   var date1 = (new Date()).toISOString().split('T')[0];
   console.log(aux[0].date);

   var sql = "INSERT INTO precios (precio, hora, unidades, Fecha_string) VALUES ?";
   var sql_= `SELECT * FROM precios WHERE Fecha_string = "${aux[0].date}"`;
   var Flag = true;

   
  
   conexion.query(sql_,(error,result)=>{
    if (error) throw error;

    if ( result.length > 0){
        //console.log(result);
        console.log("si que existe");
        Flag == true;
    }else{
        console.log("no existe");
        Flag == false;
    }
});
  


/*
   
        for ( let i = 0; i < Object.values(response.data).length ; i++){
            
        
            precio = aux[i].price;
            hora = aux[i].hour;
            unidades = aux[i].units;
            fecha = aux[i].date1;
            
            console.log(hora);
            console.log(fecha);
            console.log(precio);

            //var date = (new Date()).toISOString().split('T')[0];
            console.log(date1);
            
            var value_=[[precio,hora,unidades,fecha]];
            conexion.query(sql, [value_], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
            

        } 

   
    //conexion.query("INSERT INTO precios (precio, hora, unidades, fecha) VALUES (2.3,$hora,$unidades,'2022-02-03')");
    */
    conexion.end();

   

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

    app.get('/infoUser',(req,res) => {
        const sql = `SELECT * FROM Inicio_sesion `;

        var aux2= "Sep 09 2020 00:00:00";
        var aux = new Date("Sep 09 2020 00:00:00");
        console.log(aux);
        


        const sql2 = `SELECT * FROM Inicio_sesion WHERE fecha = ${aux2}`;

       conexion.query(sql2,(error,result)=>{
           if (error) throw error;

           if ( result.length > 0){
               res.json(result);
           }else{
               res.send('no result');
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







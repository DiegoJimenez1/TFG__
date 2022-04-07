const axios = require('axios').default;
var mysql = require('mysql');
var precios;


let url = 'https://api.preciodelaluz.org/v1/prices/avg?zone=PCB'
axios.get(url,{

})
.then((response) => {
    console.log(response);

           var info = response.data.date;
           console.log(info);
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
    
    //conexion.query('INSERT INTO precios (precio, hora, unidades, fecha) VALUES (3, 34, 23, 23)');
    
    conexion.end();



})
.catch(err => {
    console.log(err);
})






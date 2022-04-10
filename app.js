const axios = require('axios').default;
var mysql = require('mysql');
var precio,hora,unidades,fecha;


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
   var sql = "INSERT INTO precios (precio, hora, unidades, fecha) VALUES ?";
   var sql_= "SELECT * FROM precios where fecha = ?";
   var Flag = true;

   var date = (new Date()).toISOString().split('T')[0];

  /* 
   conexion.query(sql_, [date], function(err, rows, fields) {
    if (err) throw err;
    if (rows.length) {
      rows.forEach(function(row) {
        console.log("existe");
        Flag = false;
      });
    } else {
      console.log('There were no results.');
      Flag = true;
    }
  });
  
console.log(Flag);

*/
    if(Flag == true){
        for ( let i = 0; i < Object.values(response.data).length ; i++){
            
        
            precio = aux[i].price;
            hora = aux[i].hour;
            unidades = aux[i].units;
            fecha = aux[i].date;
            
            console.log(hora);
            console.log(fecha);
            console.log(precio);

            //var date = (new Date()).toISOString().split('T')[0];
            console.log(date);

                
            


            var value_=[[precio,hora,unidades,date]];
            conexion.query(sql, [value_], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });


            //conexion.query(INSERT INTO precios (precio, hora, unidades, fecha) VALUES ('$precio',));

            


            //[precio,hora,unidades,fecha]

        } 

    }else{
        console.log("ya esta en la bbdd");
    }
            
   
 
            
    
    //conexion.query("INSERT INTO precios (precio, hora, unidades, fecha) VALUES (2.3,$hora,$unidades,'2022-02-03')");
    
    conexion.end();



})
.catch(err => {
    console.log(err);
})






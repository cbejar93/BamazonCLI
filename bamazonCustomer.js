var mysql = require("mysql");
var inquirer = require("inquirer");
let customerChoice;
let customerquantity;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connection 100%%")
    readProducts();
    
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
      start();
        });
  }

  function start(){
      inquirer.prompt([
        {
              name: "id",
              type: "input",
              message: "Enter ID of product you'd like to buy"
        },
        {
            name: "quantity",
            type: "input",
            message: "How much would you like to buy?"
        }
         
    ]).then(function(response){
          let customerquantity = response.quantity;
          let customerChoice = response.id;
          connection.query("SELECT price price, stock_quanity FROM products WHERE ?", {item_id: customerChoice}, function(err,res){
            if (err) throw err;
            let productQuantity =res[0].stock_quanity;
            console.log(customerquantity);
            checker(customerquantity, productQuantity, customerChoice);
            
        })
         
      })
  }



  function checker(x, y, z){
      let change = y-x;
      console.log(change)
      if ( x > y){
        console.log("Sorry we don't have enough in stock!");
        connection.end();    
      }
      else {
            connection.query("UPDATE products SET ? WHERE ?",
                    [{
                        stock_quanity: change 
                    },
                    {
                        item_id: z
                    }

                    ], function(err, res){
                        if (err) throw err;
                        console.log("You're oder has been placed!")
                    }
            )
            connection.end();
        }

    }
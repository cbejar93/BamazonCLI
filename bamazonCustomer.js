var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table")
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
    console.log("Welcome to Amazon!")
    inquirer.prompt([
        {
          name: "selection",
          type: "list",
          message: "Please select one",
          choices: ["Customer", "Manager"]
        }
      ]).then(function(res){
          if (res.selection === "Customer"){
              console.log("hello");
              customer();
          }
          else{
              manager();
              console.log("Amazon oppreses workers")
          }
      })  
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);  
        });
  }

  function customer(){
    readProducts();
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

 function manager(){
    inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Please select one",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
      ]).then(function(manres){
          switch(manres.action){
              case "View Products for Sale":
                readProducts();
                break;
              case "View Low Inventory":
                lowInv();
                console.log("hello");
                break;
              case "Add to Inventory":
                addInv();
                break; 
              case "Add New Product":
                // newProd();
                console.log("triangles");
                break;
          }
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
                        console.log("Your order has been placed!")
                    }
            )
            connection.end();
        }

    }

    function lowInv(){ 
        connection.query("SELECT * FROM products WHERE stock_quanity BETWEEN ? AND ?", [0, 5], function(err, respond){
            if (err) throw err;
            console.table(respond);
         
        })
    }

    function addInv(){
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "Enter the item_id."
            },
            {
                name: "adder",
                type: "input",
                message: "How much would you like to add?"
            }
        ]).then(function(response){
            let itemID = response.item;
            let amountAdd = parseInt(response.adder);
            connection.query("SELECT * FROM products WHERE ?", {item_id: itemID}, function(err,res){
                let stockAmount = res[0].stock_quanity;
                console.log(stockAmount);
                sqlAdder(amountAdd, stockAmount, itemID);

            })
           
        }
    )
    }

    function sqlAdder(x , y, z){
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quanity: x + y
              },
              {
                item_id: z
              }
            ], function(err){
                if (err) throw err;
                console.log("Action Complete!");
            }
        )

    }

   
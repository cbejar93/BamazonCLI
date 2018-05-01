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

// This is the first connection to the database and gives the prompt to select user or manager 
connection.connect(function(err) {
    if (err) throw err;
    console.log("Welcome to Bamazon!")
    inquirer.prompt([
        {
          name: "selection",
          type: "list",
          message: "Please select one",
          choices: ["Customer", "Manager"]
        }
      ]).then(function(res){
          if (res.selection === "Customer"){
              customer();
          }
          else{
              manager();
          }
      })  
  });
// This function is called in two places and reads the database table 
  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);  
        });
  }
// One of two main function which allows users to select an item using ID and order the amount they wish.
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
        // This variable captures how many of an item the user would like to purchase 
          let customerquantity = response.quantity;
        //   This get the id of the item the would like to purchase
          let customerChoice = response.id;
          connection.query("SELECT price price, stock_quanity FROM products WHERE ?", {item_id: customerChoice}, function(err,res){
            if (err) throw err;
            // This grabs the amount of an item in stock from the database.
            let productQuantity =res[0].stock_quanity;
            console.log(customerquantity);
            // This function takes the 3 variables to see if there are enough to order and to change the table to subtract the changes
            checker(customerquantity, productQuantity, customerChoice);
            
        })
         
      })
  }
// The secound main function 
 function manager(){
    inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Please select one",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
      ]).then(function(manres){
        //   This grabs the users reply to the prompt above and sends them to function they want to run
          switch(manres.action){
              case "View Products for Sale":
                readProducts();
                break;
              case "View Low Inventory":
                lowInv();
                break;
              case "Add to Inventory":
                addInv();
                break; 
              case "Add New Product":
                newProd();
                console.log("triangles");
                break;
          }
      })
 }
// This is the function that checks if their is enough item in stock to order and then subtracts it from the table 
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

    // This function grabs all the items that have less than 5 things in stock and displays it.
    function lowInv(){ 
        connection.query("SELECT * FROM products WHERE stock_quanity BETWEEN ? AND ?", [0, 5], function(err, respond){
            if (err) throw err;
            console.table(respond);
            connection.end();
         
        })
    }

    // This function allows a user to add more stock to an item 
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
            // grabs the id of the item they would like to update 
            let itemID = response.item;
            // grabs how much they would like to add 
            let amountAdd = parseInt(response.adder);
            connection.query("SELECT * FROM products WHERE ?", {item_id: itemID}, function(err,res){
                // grabs how much of the selected item is in stock 
                let stockAmount = res[0].stock_quanity;
                // this function grabs the 3 local variables to add the amount to the table 
                sqlAdder(amountAdd, stockAmount, itemID);

            })
           
        }
    )
    }
// The function to add more to an item in the database
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
                connection.end();
            }
        )

    }
// A function to add an new product to the database 
    function newProd(){
        inquirer.prompt([
            {
                name: "name",
                message: "Please enter name of Product.",
                type: "input"
            },
            {
                name: "department",
                message: "Please Select which Department",
                type: "list",
                choices: ["baby", "food", "beverages", "tech", "home"]
            },
            {
                name: "cost",
                message: "How much does the item cost?",
                type: "input"
            },
            {
                name: "amount",
                message: "How much do we have in stock?",
                type: "input"
            }
        ]).then(function(res){
            console.log( res.name + " has been added to the database!")
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: res.name,
                    department_name: res.department,
                    price: res.cost,
                    stock_quanity: res.amount
                }, function(err){
                    if (err) throw err;
                    console.log("Action Complete!");
                    connection.end();
                }
            )
        })
    }

   
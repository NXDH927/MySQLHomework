var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});



function runSearch() {
  var table = new Table({
    head: ['ID', 'Product Name','Department','Price','Stock Quantity']
  , colWidths: [10, 20, 30, 10, 20]
  });
  connection.query(
    "SELECT * FROM products",
    function(err,res) {
      // console.log(res);
     for (let i = 0; i < res.length; i++) {
     var id = res[i].id;
     var product_name = res[i].product_name;
     var department_name = res[i].department_name;
     var price = res[i].price;
     var stock_quantity = res[i].stock_quantity;
     
      table.push(
        [`${id}:`, `${product_name}`, `${department_name}`, `${price}`, `${stock_quantity}`]
      
    );
     }
    console.log(table.toString());
  });




  
  inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Buy a fabulous Item!",
          "View our stock!",
          "exit"
        ]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.action === "Buy a fabulous Item!") {
          buyItem();
        }
        else if(answer.action === "View our stock!") {
          stock();
        } else{
          connection.end();
        }
      });
  }

  function buyItem() {

    inquirer
        .prompt([

            {
                name: "id",
                type: "input",
                message: "What is the item's ID?"
            },
            {
                name: "category",
                type: "input",
                message: "What category is your item in?"
            },
            {
                name:"amount",
                type:"number",
                message: "How many would you like to buy?",
                valadate: function(value) { 
                if (isNaN(value) === false) {
                    return true;
                  }
                  return false;
                }
              }
            ])
    .then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
      [answer.amount,answer.id],
      function(err,res) {
        if (err) throw err;
        console.log("Your purchased was successful!");
        runSearch();
      }
    );
  }
);
}
var mysql = require ('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var con = mysql.createConnection({
	host: 'localhost',
	port : '3306',
	user : 'root',
	password: 'XXXXXXXX',
	database: "bamazon_db"
});

con.connect(function(err){
	if (err)throw err;
	console.log('connected');
	managerPrompt();
	// viewInventory();
})

// Function to prompt the manager to select between the choices 
var managerPrompt =function() {
	inquirer.prompt({
	name 	: 'action',
	type 	: 'list',
	message	: 'what would you like to do?',
	choices	: ['View products for sale','View low inventory','Add to inventory','Add new inventory','Exit']
	}).then(function(answer){
			switch(answer.action){
				case 'View products for sale':
					  viewInventory();
					 				
						break;

				case 'View low inventory':
					  lowInventory(); 
						break;

				case 'Add to inventory':
					  addInventory();
					 	break;

				case 'Add new inventory':
					  newInventory();

						
					 	break;  

				case 'Exit':
					  connection.end();

					 
					  	break;		 			
			
			}//answer.action
		})//function(answer)
	}// function start

	 function viewInventory() {
	con.query("Select * from select_product",function(err,res){
	  if(err) throw err;
 
 	var table = new Table ({
		head: ["item_id", "product_name", "department_name","product_price","quantity"]

 	 })

	for (var i = 0; i < res.length; i++) {
		 table.push([res[i].item_id,res[i].product_name, res[i].department_name,res[i].product_price,res[i].quantity])
		 
	 }
	console.log(table.toString());
	
   
	})// query
	}// func.data

	function lowInventory() {
		con.query("Select * from select_product WHERE quantity < 5", function(err,res){
	  if(err) throw err;
	  if(res.length===0){
	  console.log("There are no item with low inventory.Please check later.")
	} else{
 
 	var table = new Table ({
		head: ["item_id", "product_name", "department_name","product_price","quantity"]

 	 })

	for (var i = 0; i < res.length; i++) {
		 table.push([res[i].item_id,res[i].product_name, res[i].department_name,res[i].product_price,res[i].quantity])
		 
	 }
	console.log(table.toString());
	console.log("this item has a low inventory")
   }
	})// query
	}// func.data

function addInventory(itemName){
var item = itemName.shift();
var itemQuantity;

// add new item to the list 
con,query('SELECT quantity from select_product WHERE ?',{
	product_name : item;
    },function(err)
    if (err)throw err;
  itemQuantity = res[0].quantity;
  itemQuantity = parse(itemQuantity);
 })//query

inquirer.prompt([{
	name:'amount',
	type: 'text',
	message: 'how many '+ item + 'you would like to add?',

	validate: function(str){
		if(isNaN(parseInt(str))){
			console.log('Not a valid entry');
			return false;
		} else {
			return true;
		}
	}//validate


		

}])//prompt









}//function	
//  connection.query('SELECT StockQuantity FROM products WHERE ?', {
//         ProductName: item
//     }, function(err, res) {
//         if (err) throw err;
//         itemStock = res[0].StockQuantity;
//         itemStock = parseInt(itemStock)
//     });
//     //ASK USER HOW MANY ITEMS HE WOULD LIKE TO ADD 
//     inquirer.prompt([{
//         name: 'amount',
//         type: 'text',
//         message: 'How many ' + item + ' would you like to add?',
//         //HANDLING WHICH MAKES INPUT TO BE A NUMBER AND NOT A LETTER 
//         validate: function(str) {
//             if (isNaN(parseInt(str))) {
//                 console.log('Sorry that is not a valid number!');
//                 return false;
//             } else {
//                 return true;
//             }
//         }
//     }]).then(function(user) {
//         var amount = user.amount
//         amount = parseInt(amount);
//         //UPDATE DATABSE PRODUCTS TO REFLECT THE NEW STOCK QUANTITY OF ITEMS.
//         connection.query('UPDATE products SET ? WHERE ?', [{
//             StockQuantity: itemStock += amount
//         }, {
//             ProductName: item
//         }], function(err) {
//             if (err) throw err;
//         });
//         //IF ITEMS STAYED IN THE ARRAY RUN THE ADDTOINVEN2 FUNCTION AGAIN 
//         if (itemNames.length != 0) {
//             addToInven2(itemNames);
//         } else {
//             //IF THERE ARE NO MORE ITEMS RUN THE MANAGER PROMPT FUNCTION TO START ALL OVER.
//             console.log('Thank you, Your inventory has been updated.');
//             managerPrompt();
//         }
//     });
// }	
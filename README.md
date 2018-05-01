# BamazonCLI

# Node.js & MySQL

## Overview

In this program users are able to choose between two tracks customer and managers.

![ALT TEXT](assets/oneprompt.png) 

Customers are able to look at a table produced by the console.table npm and then select the item_id 
of the item they would like to purchase. Users also get a prompt to ask how much they would like to order.

![ALT TEXT](assets/tablecust.png)

![ALT TEXT](assets/custprompt.png)

If there are enough to items to complete the sale, the amount the user requested is subtracted from the database. The new item amount is displayed and the user is notified that their order has been placed.

![ALT TEXT](assets/order.png)

The program terminates after that.

If a user picks manager, they are presented with four different choices. 

![ALT TEXT](assets/managerview.png)

The first option gives the user a table of the items for sale like the one the customer recieves. 

The secound option gives the user a table of any item with less than 3 units left in stock.

![ALT TEXT](assets/lowinv.png)

The third options allows the user to give an item more inventory.

![ALT TEXT](assets/addinv.png)

The last option allows the user to put an item of their choice into the databse.

![ALT TEXT](assets/newprod.png)

Here is a look at the databse table after all our changes. 

![ALT TEXT](assets/database.png)

This application uses node to be able to talk to a mySQL server.








# DataStructs
## .describe()
Provides the title for the table
## .getIds()
Provides identifiers for which things such as which column is currently being sorted is coded in and for deserializing data from the server
## .types()
Provides type information. The sorter uses this and the add and edit modals also uses this for input validation.
### Valid Types:
string, number
will add as needed
## .constraints()
Provides constraint information for the add and edit modals
## Valid arguments
moreThan: number, lessThanOrEqualTo: number for numbers
canBeEmpty: bool for any
will add as needed

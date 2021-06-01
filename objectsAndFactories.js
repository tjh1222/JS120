/*

Attributes
  Title: Mythos
  Author: Stephen Fry

Behavior:
  Get Description

-----------------------------
Attributes
  Title: Me Talk Pretty One Day
  Author: David Sedaris

Behavior:
  Get Description

-----------------------------
Attributes
 Title: Aunts aren't Gentlemen
 Author: PG Wodehouse

 Behavior:
   Get Description


*/

/*
Create three objects that represent the three books shown above. 
The method for the "Get Description" behavior should return a string
like the following:

"Me Talk Pretty one day was written by David Sedaris."
*/

// let book1 = {
//     title: "Mythos",
//     author: "Stephen Fry",

//     getDescription() {
//         return `${this.title} was written by ${this.author}`
//     }
// }

// let book2 = {
//     title: "Me Talk Pretty One Day",
//     author: "David Sedaris",

//     getDescription() {
//         return `${this.title} was written by ${this.author}`
//     }
// }

// let book3 = {
//     title: "Aunts aren't Gentlemen",
//     author: "PG Wodehouse",

//     getDescription() {
//         return `${this.title} was written by ${this.author}`
//     }
// }

// console.log(book1.getDescription());
// console.log(book2.getDescription());
// console.log(book3.getDescription());


/*

Given our observations about the code so far
implement a factory function for our book objects
that we can use with the following code:

*/

function createBook (title, author, read = false) {
    return {
        title,
        author,
        read,


        getDescription() {
            if (this.read) {
                return `${this.title} was written by ${this.author}. I have read it.`
            }
            return `${this.title} was written by ${this.author}. I haven't read it.`
        },

        readBook() {
            this.read = true;
        }
    };
}


let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse');

console.log(book1.getDescription());  // "Mythos was written by Stephen Fry."
console.log(book2.getDescription());  // "Me Talk Pretty One Day was written by David Sedaris."
console.log(book3.getDescription());  // "Aunts aren't Gentlemen was written by PG Wodehouse"

console.log(book1.readBook()); // => false
console.log(book1.getDescription());  // "Mythos was written by Stephen Fry."

console.log(book1.read); // => false

// console.log(book2.read); // => false
// console.log(book3.read); // => false

/*

agregar referencia de github


*/

let formName, impt_title, impt_author, impt_pages, impt_read;
let btn_save = document.getElementById('b_save');
let successMessage = document.getElementById('alert');
let myLibrary = [];
let bookId = 0;
//Se obtiene el container donde se van a mostrar la lista de libros
const container = document.getElementById('listBooks');

function Book(bookId, title, author, pages, read) {
    this.bookId = bookId;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        let information = this.title + " por " + this.author + " con " + this.pages + " pagina(s), " + "¿Leido?: " + this.read;
        return information;
    }
}

//El array myLibrary hereda las propiedades de Book
myLibrary.prototype = Object.create(Book.prototype);
Storage.prototype = Object.create(Book.prototype);

//Si hay datos en la sesion los guardo dentro del array local
if (sessionStorage.getItem('books')) {
    myLibrary = JSON.parse(sessionStorage.getItem('books'))
    myLibrary.forEach((element) => {
        //Genero una tarjeta por cada elemento en el array
        ShowBookList(element.bookId, element.title, element.author, element.pages, element.read);
        //cargo el ultimo bookId
        bookId = element.bookId
    });
} else {
    //Sino genero los ejemplos
    createSamples();
}

//Guarda los datos ingresados cuando se presiona el boton guardar
btn_save.onclick = submit;

function submit() {
    formName = document.forms['newBook'];
    inpt_title = formName['bookTitle'].value;
    inpt_author = formName['bookAuthor'].value;
    inpt_pages = formName['bookPages'].value;
    if (document.getElementById("readSiwtch").checked) {
        inpt_read = 'Si'
    } else {
        inpt_read = 'No'
    }
    addBookToLibrary(inpt_title, inpt_author, inpt_pages, inpt_read);
}

//Agrega el nuevo libro a la lista
function addBookToLibrary(title, author, pages, read) {

    if (validateEntry(title, author, pages)) {
        bookId++;
        let newBook = new Book(bookId, title, author, pages, read);
        myLibrary.push(newBook);
        updateSessionStore();
        ShowBookList(bookId, title, author, pages, read)
    }
}

//Valida los datos ingresados
function validateEntry(title, author, pages) {
    //Reinicia los campos del formulario
    document.getElementById("newBook").reset();
    if (!title == '' && !author == '' && !pages == '') {
        if (Number.isInteger(parseInt(pages))) {
            if (validateExistence(title, author)) {
                showAlert();
                return true;
            }
        } else {
            alert("La cantidad de páginas solo deben ser numeros");
            successMessage.style.display = "none";
            return false;
        }
    } else {
        alert("Los campos no deben estar vacios");
        successMessage.style.display = "none";
        return false;
    }
}

//Valida si el libro ingresado ya existe
function validateExistence(title, author) {
    //Recorre el array
    for (var i = 0; i < myLibrary.length; i++)
        if (myLibrary[i].title == title && myLibrary[i].author == author) {
            alert("Este libro ya esta guardado");
            return false;
        }
    return true;
}

//Muestra los libros en tarjetas
function ShowBookList(bookId, title, author, pages, read) {
    let content;
    let check_read;
    //Si el libro esta leido que marque tildado
    if (read == 'Si') {
        check_read = " checked";
    } else {
        check_read = " ";
    }
    // Crea card element
    const card = document.createElement('div');
    card.classList = 'card-body';
    // constructor de card content
    content = `
<div class="card" id="${bookId}">
<div class="card-header" id="heading-${bookId}">
    <h5>${title}</h5>
    <button type="button" id="deleteBook" class="btn btn-outline-danger" onclick="deleteBook(${bookId})">X</button>
</div>
<div class="card-body">
    <div id="bookInfo">
        <p>${author}</p>
        <p>${pages} paginas</p>
    </div>
    <div id="readInfo">
    <div class="form-check">           
        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" ${check_read} onchange="changeStatusRead(this , ${bookId})">                
        <label class="form-check-label" for="flexCheckDefault">Leído</label>
    </div>
</div>
</div>
`;
    // Agrega el elemento creado al div
    container.innerHTML += content;
}

//Updatea el valor de leido sobre el libro que se chequea
function changeStatusRead(checkboxElem, bookReadId) {
    //Recorre el array
    for (var i = 0; i < myLibrary.length; i++)
        if (myLibrary[i].bookId === bookReadId) {
            if (checkboxElem.checked) {
                if (myLibrary[i].read != "Si") {
                    myLibrary[i].read = "Si"
                }
            } else {
                if (myLibrary[i].read != "No") {
                    myLibrary[i].read = "No"
                }
            }
            //guardo el cambio
            updateSessionStore()
            break;
        }
}

//Elimina el div y el libro del array
function deleteBook(bookIdDel) {
    //Recorre el array
    for (var i = 0; i < myLibrary.length; i++)
        //Busca el indice del id del libro que se quiere eliminar
        if (myLibrary[i].bookId === bookIdDel) {
            if (window.confirm("¿Deseas eliminar el libro " + myLibrary[i].title + " ?")) {
                myLibrary.splice(i, 1);
                document.getElementById(bookIdDel).remove();
                //guardo el cambio
                updateSessionStore()
                break;
            }
        }
}

function showAlert() {
    successMessage.style.display = 'block';
    setTimeout(function () { successMessage.style.display = 'none' }, 1700);
}

function createSamples() {
    addBookToLibrary('The hobbit', 'J. R. R. Tolkien', '355', 'Si');
    addBookToLibrary('Harry Potter and the Philosopher’s Stone', 'J. K. Rowling', '300', 'Si');
    addBookToLibrary('A Song of Ice and Fire', 'George R. R. Martin', '694', 'No');
    addBookToLibrary('The Maze Runner', 'James Dashner', '375', 'No');
    successMessage.style.display = "none";
}

function updateSessionStore() {
    sessionStorage.setItem("books", JSON.stringify(myLibrary))
}

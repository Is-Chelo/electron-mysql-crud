const { remote } = require("electron");
const main = remote.require("./main");
const Swal = require('sweetalert2')
const title = document.getElementById("tituloForm");
const contactForm = document.querySelector("#categoryForm");
const btnSave = document.querySelector("#btnSave");
const contactName = document.querySelector("#name");
const contactEmail = document.querySelector("#email");
const contactInstitute = document.querySelector("#institute");
const contactPhone = document.querySelector("#phone");
const contactInfomation = document.querySelector("#infomation");

let products = [];
let editingStatus = false;
let editProductId;
let contactsList = document.querySelector("#contacts");

const openModal = () => {
    title.innerHTML = "Agregar Contacto.";
    const myModal = new bootstrap.Modal("#staticBackdrop", {
        keyboard: false,
    });
    myModal.show();
};
const closeModal = () => {
    // title.innerHTML = "Agregar Contacto.";
    const myModal = new bootstrap.Modal("#staticBackdrop", {
        keyboard: false,
    });
    myModal.hide();
};


const resetForm = () => {
    contactForm.reset();
};

// Crear
const saveForm = async (e) => {
    const idUpdate = btnSave.getAttribute("id-update");
    e.preventDefault();
    if (idUpdate === null) {
        try {
            const contacts = {
                nombre: contactName.value,
                telefono: contactPhone.value,
                correo: contactEmail.value,
                institucion: contactInstitute.value,
                informacion: contactInfomation.value,
            };
            const savedContact = await main.createContact(contacts);
            if (savedContact.id) {
                  Swal.fire(
                    "Guardado!",
                    "Contacto Guardado correctamente.",
                    "success"
                );
                contactForm.reset();
                contactName.focus();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Oops...",
                    text: "Ocurrio un error al intentar guardar el contacto.",
                    showConfirmButton: false,
                    timer: 2500,
                });
                contactName.focus();
            }

            getContacts();
        } catch (error) {
            console.log(error);
        }
  }else{
    const contacts = {
      nombre: contactName.value,
      telefono: contactPhone.value,
      correo: contactEmail.value,
      institucion: contactInstitute.value,
      informacion: contactInfomation.value,
    };
    const updatedContact = await main.updateContact(idUpdate, contacts);
    console.log(updatedContact)
    if(updatedContact.affectedRows>0){
      Swal.fire(
        "Actualizado!",
        "Contacto Actualizado correctamente.",
        "success"
      );
    }else{
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Oops...",
        text: "Ocurrio un error al actualizar eliminar.",
        showConfirmButton: false,
        timer: 2500,
     });
    }
    btnSave.removeAttribute("id-update");
    getContacts();
   
  }
};
// Eliminar
const deleteContact = async (id) => {
    Swal.fire({
        title: "Estas seguro?",
        text: "No podras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
        if (result.isConfirmed) {
            const result = await main.deleteContact(id);
            if (result.affectedRows) {
                Swal.fire(
                    "Eliminado!",
                    "Contacto eliminado correctamente.",
                    "success"
                );
                getContacts();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Oops...",
                    text: "Ocurrio un error al intentar eliminar.",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        }
    });
};

// Listar
function renderContacts(tasks) {
    contactsList.innerHTML = "";
    tasks.forEach((t) => {
        contactsList.innerHTML += `
        <tr>
          <td>${t.idcontactos}</td>
          <td>${t.nombre}</td>
          <td>${t.telefono}</td>
          <td>${t.correo}</td>
          <td>${t.institucion}</td>
          <td>${t.informacion}</td>
          <td>
            <a onclick="deleteContact(${t.idcontactos})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="color:red; cursor:pointer" class=" bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg>
            </a>
            <a onclick="setContact(${t.idcontactos})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="color:lightsalmon; margin-left:15px; cursor:pointer" class=" bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
              </svg>
            </a>
          </td>
        </tr>
    `;
    });
}

const getContacts = async () => {
    contacts = await main.getContacts();
    renderContacts(contacts);
};

const setContact = async (id) => {
    title.innerHTML = "Actualizar Contacto";
    btnSave.setAttribute("id-update", id);

    //TODO: Get Data
    const contactById = await main.getContactById(id);

    // * ADD data and update title
    contactName.value = contactById.nombre;
    contactEmail.value = contactById.correo;
    contactInstitute.value = contactById.instituto;
    contactPhone.value = contactById.telefono;
    contactInfomation.value = contactById.informacion;

    const myModal = new bootstrap.Modal("#staticBackdrop", {
        keyboard: false,
    });
    myModal.show();
};

async function init() {
    getContacts();
}

init();

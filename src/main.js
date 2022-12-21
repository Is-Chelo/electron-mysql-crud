const { BrowserWindow, Notification } = require("electron");
const { getConnection } = require("./database");
const path =require('path')
let window;

const createContact = async (contact) => {

  try {
    const conn = await getConnection();
    const result = await conn.query("INSERT INTO contactos SET ?", contact);

    contact.id = result.insertId;
    // Notify the User
    new Notification({
      title: "Electron Mysql",
      body: "Nuevo Contacto Guardado",
    }).show();

    return contact;
  } catch (error) {
    console.log("error: ",error);
  }
};

const getContacts = async () => {
  const conn = await getConnection();
  const results = await conn.query(`SELECT * FROM contactos ORDER BY idcontactos ASC`);
  // console.log(results)
  return results;
};



const deleteContact = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("DELETE FROM contactos WHERE idcontactos = ?", id);
  return result;
};



const getContactById = async (id) => {
  const conn = await getConnection();
  const result = await conn.query("SELECT * FROM contactos WHERE idcontactos = ?", id);
  return result[0];
};

const updateContact = async (id, product) => {
  const conn = await getConnection();
  const result = await conn.query("UPDATE contactos SET ? WHERE idcontactos = ?", [
    product,
    id,
  ]);
  return result
};

function createWindow() {
  window = new BrowserWindow({
    width: 900,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    icon:path.join(__dirname, './ui/icono.ico')
  });

  window.loadFile("src/ui/index.html");
}

module.exports = {
  createWindow,
  // createProduct,
  createContact,
  getContacts,
  deleteContact,
  getContactById,
  updateContact
};

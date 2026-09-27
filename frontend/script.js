const API_URL = "http://localhost:3000/users";

const addForm = document.getElementById("addForm");
const editForm = document.getElementById("editForm");
const table = document.getElementById("userTable");
const searchInput = document.getElementById("searchInput");

let selectedId = null;
let allUsers = [];


// LOAD USERS
async function loadUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();

    allUsers = users;

    displayUsers(users);
}


// DISPLAY USERS
function displayUsers(users) {

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
        </tr>
    `;

    users.forEach(user => {

        const row = table.insertRow();

        row.insertCell(0).textContent = user.name;
        row.insertCell(1).textContent = user.email;

        const actionCell = row.insertCell(2);

        actionCell.innerHTML = `
            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">
                Edit
            </button>

            <button onclick="deleteUser(${user.id})">
                Delete
            </button>
        `;
    });
}


// SEARCH USERS
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText)
    );

    displayUsers(filteredUsers);
});


// ADD USER
addForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (name === "" || email === "") {
        alert("Please enter name and email");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    addForm.reset();

    loadUsers();
});


// EDIT USER
function editUser(id, name, email) {

    selectedId = id;

    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
}


// UPDATE USER
editForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (selectedId === null) {
        alert("Please click Edit first");
        return;
    }

    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;

    if (name === "" || email === "") {
        alert("Please enter name and email");
        return;
    }

    await fetch(`${API_URL}/${selectedId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    selectedId = null;

    editForm.reset();

    loadUsers();

    alert("User updated successfully!");
});


// DELETE USER
async function deleteUser(id) {

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}


// LOAD USERS WHEN PAGE OPENS
loadUsers();
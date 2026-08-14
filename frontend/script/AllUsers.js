const userscontainer = document.querySelector("#users-container")
// console.log(userscontainer);

async function getAllUser() {
    try {
        let resp = await fetch("http://localhost:5000/users");
        let data = await resp.json();
        // console.log(data);
        displayUsers(data)
    } catch (error) {
        // console.log(error);
    }
}
getAllUser()

function displayUsers(users){
// console.log(users);

users.forEach((user)=>{
   let {fullname, email, password, id} = user;
   const userDiv = document.createElement("div")
   userDiv.className = "user-card"
   userDiv.id = `user-${id}`;

   userDiv.innerHTML=`
   <figure class='user-avata'>${fullname[0].toUpperCase()}</figure>
   <h3>${fullname}</h3>
   <p>${email}</p>
   <p>${password}</p>
   <button class='edit-btn' onclick='editUser(${id})' >Edit</button>
   <button class='delete-btn' onclick='deleteUser(${id})'>Delete</button>
   `;
  userscontainer.append(userDiv);
})}

function editUser(id){
    console.log(id);
    window.location.href = `EditUser.html?id=${id}`;
    
}
async function deleteUser(id){
   fetch(`http://localhost:5000/users/${id}`,{
    method: "DELETE",
   });
   alert("User Deleted")
}

document.addEventListener('DOMContentLoaded', () => {

    isSelf();

   function isSelf(){
       const url = new URL(window.location.href);
       const username = url.searchParams.get('user').replaceAll('\"', '');

       const formData = new FormData();
       const str = "username"
       formData.append(str, username);

       fetch("person.php",{
           method:"POST",
           body:formData,
           credentials: "include"
       }).then(response => response.json())
           .then(data => {
               updateButton(data.isSelf)
               updatePerson(data.username);
           })
           .catch(error => console.error('Error:', error));
   }

   function updatePerson(username) {
        usernameTitle = document.getElementById('username');
        usernameTitle.textContent = username;
   }

   function updateButton(isSelf) {
       addFriendBtn=document.getElementById("add_friend");
       muteBtn=document.getElementById("mute");
       blockBtn=document.getElementById("block");
       editBtn=document.getElementById("edit");
       uploadBtn=document.getElementById("upload");
        if (isSelf) {
            addFriendBtn.remove();
            muteBtn.remove();
            blockBtn.remove();
        }else{
            editBtn.remove();
            uploadBtn.remove();
        }
   }
});
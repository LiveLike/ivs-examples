(function () {
  // Utility for handling open and closing drawer buttons
  const openMember = document.querySelector(".open#member");
  const closeMember = document.querySelector(".close#member");
  const memberDrawer = document.querySelector(".drawer#member");

  const openChat = document.querySelector(".open#chat");
  const closeChat = document.querySelector(".close#chat");
  const chatDrawer = document.querySelector(".drawer#chat");

  openMember.addEventListener("click", (e) => {
    memberDrawer.classList.remove("hidden");
  });

  openChat.addEventListener("click", (e) => {
    chatDrawer.classList.remove("hidden");
  });

  closeMember.addEventListener("click", (e) => {
    memberDrawer.classList.add("hidden");
  });

  closeChat.addEventListener("click", (e) => {
    chatDrawer.classList.add("hidden");
  });
})();


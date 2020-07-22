import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const loggedUserName = document.getElementById("jsLoggedUserName");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentBtn = document.querySelectorAll(".comment-delete button");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};
const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};
const addComment = (comment) => {
  const li = document.createElement("li");
  const text = document.createElement("div");
  const creator = document.createElement("div");
  text.innerHTML = comment;
  text.classList.add("comment-text");
  creator.innerHTML = `from ${loggedUserName.innerHTML}`;
  creator.classList.add("comment-creator");
  li.appendChild(text);
  li.appendChild(creator);
  commentList.prepend(li);
  increaseNumber();
};
const deleteComment = (commentId) => {
  const li = document.getElementById(commentId);
  li.parentNode.removeChild(li);
  decreaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const handleDelete = async (event) => {
  event.preventDefault();
  const btn = event.target;
  const commentId = btn.parentNode.id;
  const response = await axios({
    url: `/api/${commentId}/deleteComment`,
    method: "POST",
    data: { commentId },
  });
  if (response.status == 200) {
    deleteComment(commentId);
  }
};
function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  if (deleteCommentBtn) {
    for (let i = 0; i < deleteCommentBtn.length; i++) {
      deleteCommentBtn[i].addEventListener("click", handleDelete);
    }
  }
}
if (addCommentForm) {
  init();
}

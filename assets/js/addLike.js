import axios from "axios";

const addLikeBtn = document.getElementById("jsLikeButton");
const likeNumber = document.getElementById("jsLikeNumber");

const updateLike = () => {
  likeNumber.innerHTML = parseInt(likeNumber.innerHTML, 10) + 1;
};

const addLike = async () => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/like`,
    method: "POST",
  });
  if (response.status === 200) {
    updateLike();
  }
};

const handleClickAddLike = () => {
  event.preventDefault();
  addLike();
};

function init() {
  addLikeBtn.addEventListener("click", handleClickAddLike);
}
init();

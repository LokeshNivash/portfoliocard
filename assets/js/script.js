'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

//rotationt titles
const titles = ["MECHATRONICS ENGINEER", "GRAPHIC DESIGNER", "ANIMATOR"]; // Array of titles
  let currentIndex = 0; // Starting index

  function changeTitle() {
    document.getElementById("jobtitle").innerText = titles[currentIndex]; // Set the title
    currentIndex = (currentIndex + 1) % titles.length; // Move to the next title or loop back to the first
  }

  setInterval(changeTitle, 1500); // Change title every 1.5 seconds (1500 milliseconds)

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// counter js
const counters = document.querySelectorAll('.counter');
const speed = 2000; // The lower the slower

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const text = counter.getAttribute('data-text'); // Get the text
        let count = 0;

        const increment = Math.ceil(target / speed);

        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                clearInterval(interval);
                count = target;
            }
            counter.innerText = count+text;
        }, 200);
    };

    updateCount();
});



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

function sendEmail() {
  var params = {
    from_name : document.getElementById("fullName").value,
    email_id : document.getElementById("email_id").value,
    message : document.getElementById("message").value
  }
  emailjs.send("service_2wey0vj", "template_wxqwbqs", params).then(function (resp) {
      alert("success ! +" + res.status);
  })
}

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// download button
const fileSrc = 'assets/images/avatar-1.png';
document.addEventListener("DOMContentLoaded", function(){
  this.querySelector(".icon").addEventListener("click", function(){
    let waitClass = "waiting",
        runClass = "running",
        cl = this.classList;

    if (!cl.contains(waitClass) && !cl.contains(runClass)) {
      cl.add(waitClass);
      setTimeout(function(){
        cl.remove(waitClass);
        setTimeout(function(){
          cl.add(runClass);
          
          // Add the file source location here
          const fileSrc = 'assets/images/works/LokeshR-Resume.pdf';
          
          // Create an anchor element for downloading
          const downloadLink = document.createElement('a');
          downloadLink.href = fileSrc;
          downloadLink.setAttribute('download', ''); // This attribute triggers the download
          
          // Append the anchor element to the body (for it to work in some browsers)
          document.body.appendChild(downloadLink);
          
          // Programmatically trigger the click event
          downloadLink.click();
          
          // Remove the anchor element from the body
          document.body.removeChild(downloadLink);
          
          setTimeout(function(){
            cl.remove(runClass);
          }, 4000);
        }, 200);
      }, 1800);
    }
  });
});


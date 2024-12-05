let city = document.getElementById("city-selected").value; // Initialize with the selected city from the HTML dropdown
let currentLanguage = "en"; // Default language is English
document.getElementById("ville").innerHTML =   city

// Function to handle city selection and update the city variable
function handleCity() {
  const selectCity = document.getElementById("city-selected");
  city = selectCity.value; // Update city value based on selection
  console.log("Selected City:", city); // Log the updated city value
  document.getElementById("ville").innerHTML = city
  getTimes(city); // Fetch prayer times for the selected city
}




// Display the current date
document.getElementById("container-date").innerHTML += `
        <p class="font-bold text-cyan-200 m-4">${new Date().toLocaleDateString()}</p>
      `;

      // Function to display current date in correct format based on language
function displayCurrentDate() {
  const dateElement = document.getElementById("container-date");  // New container for date display
  const currentDate = new Date();

  // Locale options for the desired date format
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };

  const formattedDate = currentLanguage === "ar"
    ? currentDate.toLocaleDateString('ar-AR', options)  // Arabic locale
    : currentDate.toLocaleDateString('en-GB', options);  // English locale (e.g., UK formatting)

  // Display the date
  dateElement.innerHTML = `<p class="font-bold text-cyan-200 m-4">${formattedDate}</p>`;
}

// Call this function to display the current date when the page loads
displayCurrentDate();


// Function to fetch and display prayer times
function getTimes(city) {
  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const url = `https://api.aladhan.com/v1/timingsByCity/${currentDate}?city=${city}&country=Morocco&language=${currentLanguage}`;

  // Make the API request using axios
  axios
    .get(url)
    .then((response) => {
      const data = response.data;
      console.log(data); // Log the full data object
      const timings = data.data.timings; // Extract prayer timings
      console.log(timings); // Log the prayer timings

      // Get the div container where prayer times will be displayed
      const divContainer = document.getElementById("prayer");
      divContainer.innerHTML = ""; // Clear any previous content

      // Define translation for prayer names
      const prayerNames = {
        en: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
        ar: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"],
      };

      let isArabic = currentLanguage === "ar";

      const prayerToDisplay = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      // Update the table headers based on the language
      const prayerHeader = document.getElementById("prayer-header");
      const timeHeader = document.getElementById("time-header");

      // Toggle alignment for headers
      if (isArabic) {
        prayerHeader.classList.add("text-right");
        timeHeader.classList.add("text-right");
        prayerHeader.innerHTML = "الفريضة";
        timeHeader.innerHTML = "وقت الأذان";
      } else {
        prayerHeader.classList.remove("text-right");
        timeHeader.classList.remove("text-right");
        prayerHeader.innerHTML = "Prayer";
        timeHeader.innerHTML = "Time";
      }

      // Iterate over the timings and display each prayer time
      prayerToDisplay.forEach((prayer, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("border-b");

        const tdPrayer = document.createElement("td");
        tdPrayer.classList.add("px-6", "py-4");
        tdPrayer.innerHTML = `<strong>${prayerNames[currentLanguage][index]}</strong>`; // Use translated prayer name
        // Align time to the right if Arabic
        if (isArabic) tdPrayer.classList.add("text-right");

        const tdTimes = document.createElement("td");
        tdTimes.classList.add("px-6", "py-4");
        tdTimes.id = `${prayer.toLocaleLowerCase()}-time`; // Dynamic ID for each prayer time
        tdTimes.innerHTML = timings[prayer];
        // Align time to the right if Arabic
        if (isArabic) tdTimes.classList.add("text-right");

        tr.appendChild(tdPrayer);
        tr.appendChild(tdTimes);

        divContainer.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Handle errors
    });

  console.log("API request made");
}

// Initial call to get prayer times for the default city
getTimes(city);

// Language button click events
document.getElementById("ARlanguage").addEventListener("click", function () {
  currentLanguage = "ar"; // Set language to Arabic
  document.getElementById("body").setAttribute("dir", "rtl"); // Set body direction to RTL
  document.getElementById("header").innerHTML = "مواقيت الصلاة";
  document.getElementById("select-city").innerHTML = "إختر المدينة";
  updateCityNames("ar"); // Update city names in Arabic

  document.getElementById("ARlanguage").innerHTML = "العربية";
  document.getElementById("ENlanguage").innerHTML = "الإنجليزية";

  // Toggle active class
  document.getElementById("ENlanguage").classList.remove("active");
  document.getElementById("ARlanguage").classList.add("active");

  console.log("Current language is " + currentLanguage);
  getTimes(city); // Refresh prayer times with Arabic language
  displayCurrentDate();
});

document.getElementById("ENlanguage").addEventListener("click", function () {
  currentLanguage = "en"; // Set language to English
  document.getElementById("body").setAttribute("dir", "ltr"); // Set body direction to LTR
  document.getElementById("header").innerHTML = "Prayer Times";
  document.getElementById("select-city").innerHTML = "Select City";
  updateCityNames("en"); // Update city names in English

  document.getElementById("ARlanguage").innerHTML = "AR";
  document.getElementById("ENlanguage").innerHTML = "EN";

  // Toggle active class
  document.getElementById("ARlanguage").classList.remove("active");
  document.getElementById("ENlanguage").classList.add("active");

  console.log("Current language is " + currentLanguage);
  getTimes(city); // Refresh prayer times with English language
  displayCurrentDate();
});
const cityNames = {
  en: {
    Rabat: "Rabat",
    Casablanca: "Casablanca",
    Fes: "Fes",
    Oujda: "Oujda",
    Tanger: "Tanger",
    Sale: "Sale",
  },
  ar: {
    Rabat: "الرباط",
    Casablanca: "الدار البيضاء",
    Fes: "فاس",
    Oujda: "وجدة",
    Tanger: "طنجة",
    Sale: "سلا",
  }
};

function updateCityNames(language) {
  const citySelect = document.getElementById("city-selected");
  for (const city of citySelect.options) {
    city.innerHTML = cityNames[language][city.value];
  }
}


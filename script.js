let translatedText = ""; 
const voiceInputButton = document.getElementById("voice-input-btn");

// Check if browser supports SpeechRecognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition(); // or SpeechRecognition()

  voiceInputButton.addEventListener("click", () => {
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputTextElem.value = transcript;
      translate();
    };

    recognition.onend = () => {
      voiceInputButton.textContent = "Start Voice Input";
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    voiceInputButton.textContent = "Listening...";
  });
} else {
  console.error("Speech recognition is not supported in this browser.");
}



const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputLanguageDropdown = document.querySelector("#input-language"),
  outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });

  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      //remove active class from current dropdowns
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});
document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

const swapBtn = document.querySelector(".swap-position"),
  inputLanguage = inputLanguageDropdown.querySelector(".selected"),
  outputLanguage = outputLanguageDropdown.querySelector(".selected"),
  inputTextElem = document.querySelector("#input-text"),
  outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  //swap text
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translate();
});

function translate() {
  const inputText = inputTextElem.value;
  const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

  fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      translatedText = json[0].map(item => item[0]).join(""); // Update the global translatedText variable
      outputTextElem.value = translatedText; // Update the output text area
      speakTranslatedParagraphs(translatedText); // Speak the translated text
    })
    .catch(error => {
      console.log(error);
    });
}


inputTextElem.addEventListener("input", (e) => {
  //limit input to 5000 characters
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
  translate();
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElem.value = e.target.result;
      translate();
    };
  } else {
    alert("Please upload a valid file");
  }
});

const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", (e) => {
  const outputText = outputTextElem.value;
  const outputLanguage =
    outputLanguageDropdown.querySelector(".selected").dataset.value;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});





const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
  inputChars.innerHTML = inputTextElem.value.length;
});




// Get references to input and summary text areas
const inputTextArea = document.getElementById("input-text");
const summaryTextArea = document.getElementById("summary-text");

// Function to generate a summary
function generateSummary() {
  const inputText = inputTextArea.value;

  // Split the input text into sentences
  const sentences = inputText.split(/[.?!\n]/).filter(sentence => sentence.trim() !== '');

  // Choose a subset of sentences to form the summary (e.g., first three sentences)
  const summarySentences = sentences.slice(0, 3);

  // Join the selected sentences to form the summary
  const summarizedText = summarySentences.join(' ');

  summaryTextArea.value = summarizedText;
}

// Your existing code ...

// Function to perform text summarization
function generateSummary(inputText) {
  // Implement your text summarization logic here
  // For example, split the text into sentences and choose a subset for summary
  const sentences = inputText.split(/[.?!\n]/).filter(sentence => sentence.trim() !== '');
  const summarySentences = sentences.slice(0, 3);
  const summarizedText = summarySentences.join(' ');
  return summarizedText;
}

// Attach event listener to the text summarization button
// Attach event listener to the text summarization button
const summarizeButton = document.getElementById("summarize-button");
summarizeButton.addEventListener("click", () => {
  const inputText = inputTextElem.value; // Retrieve input text from textarea
  const summary = generateSummary(inputText); // Generate summary
  summaryTextArea.value = summary; // Display the generated summary
  speak("Summary generated: " + summary); // Optional: Speak the summary
});

// Rest of your existing code ...



// Rest of your existing code ...




// Enable speech synthesis+
const synth = window.speechSynthesis;

// Function to speak the given text
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

// Speak the page title
speak("Welcome to Language Translator");

// Speak the description of the dark mode button
speak("You can toggle dark mode using the button.");

// Speak the input text area description
speak("Enter the text you want to translate in the text area.");

// Speak the output text area description
speak("The translated text will appear in the output text area.");

// Speak the button to start voice input
speak("You can also start voice input by clicking the button.");

// Speak the button to upload a document
speak("You can choose a document to translate by clicking the 'Choose File' button.");

// Speak the button to swap input and output languages
speak("You can swap the input and output languages using the swap button.");

// Speak the button to download translated text as a document
speak("You can download the translated text as a document by clicking the download button.");

// Speak the description of the dropdown menus
speak("You can select input and output languages from the dropdown menus.");

// Speak the description of the language selection
speak("To select a language, click on the respective dropdown and choose from the options.");

// Speak the description of the character count
speak("You can see the character count of your input text below the text area.");

// Function to read the selected language from the dropdown
function readSelectedLanguage(dropdown) {
  const selected = dropdown.querySelector(".selected");
  speak(`Selected language is ${selected.textContent}`);
}

// Speak the selected input and output languages
readSelectedLanguage(inputLanguageDropdown);
readSelectedLanguage(outputLanguageDropdown);


// Function to speak paragraphs of the translated output
function speakTranslatedParagraphs() {
  if (translatedText) {
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.pitch = 1;  // Adjust as needed
    utterance.rate = 1;   // Adjust as needed

    // Listen for the end of speech
    utterance.onend = () => {
      console.log("Speech finished");
    };

    speechSynthesis.speak(utterance);
  } else {
    speak("Translated output is empty.");
  }
}



outputTextElem.addEventListener("input", () => {
  // Delay a bit before speaking to ensure the translation is complete
  setTimeout(() => {
    speakEntireTranslatedOutput(outputTextElem);
  }, 1000); // You can adjust the delay as needed
});



// Function to read the current dark mode status
function readDarkModeStatus() {
  const darkModeStatus = document.body.classList.contains("dark") ? "enabled" : "disabled";
  speak(`Dark mode is currently ${darkModeStatus}`);
}

// Event listeners for specific interactions
voiceInputButton.addEventListener("click", () => {
  speak("Starting voice input. Please speak now.");
});

swapBtn.addEventListener("click", () => {
  speak("Swapping input and output languages.");
  readSelectedLanguage(inputLanguageDropdown);
  readSelectedLanguage(outputLanguageDropdown);
});

inputTextElem.addEventListener("input", () => {
  speakTranslatedParagraphs(translatedText);
});

darkModeCheckbox.addEventListener("change", () => {
  readDarkModeStatus();
});

// Additional event listeners for dropdown interactions, document upload, and download are not included in this example.
// You can customize and include them similarly if needed.
document.getElementById("clickSubmit").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: clickSubmitButton,
    });
  });
});
// text-token-text-error
const clickSubmitButton = async () => {
  const createProgressStatus = () => {
    const style = document.createElement("style");
    style.textContent = `
      .autofy-bot-progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
        transition: 0.5s;
      }
  
      .progress-container {
        width: max-content;
        max-width: 90vw;
        border-radius: 10px;
        background-color: #FFF;
        border: 1px solid #e4e4e4;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
  
      .progress-container input[type="file"] {
        font-size: 14px;
        padding: 6px;
      }
  
      .progress-container button {
        padding: 6px 12px;
        font-size: 14px;
        cursor: pointer;
        border: none;
        background-color: #233090;
        color: white;
        border-radius: 5px;
      }
  
      .progress-container button:hover {
        background-color: #1b256f;
      }
    `;
    document.head.appendChild(style);

    const parentDiv = document.querySelector("body");
    const htmlString = `
      <div class="autofy-bot-progress-container" id="progress-container">
        <div class="progress-container">
          <input type="file" />
          <button id="index-request-submit-btn">Submit</button>
        </div>
      </div>
    `;
    const newElement = document.createElement("div");
    newElement.innerHTML = htmlString;
    parentDiv.appendChild(newElement);

    // Add click listener for Submit button
  };

  const scrapeHandler = () => {
    const searchInputField = document.querySelector("input.Ax4B8.ZAGvjd");
    if (searchInputField) {
      console.log("hello if");
      searchInputField.value =
        "https://somacharnews.com/news/680915df27070bc4e7aca4b7";
      searchInputField.dispatchEvent(new Event("input", { bubbles: true }));
      searchInputField.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const searchButton = document.querySelector('button[aria-label="Search"]');

    if (searchButton) {
      searchButton.click();
    }
    console.log("hello form before time");

    setTimeout(() => {
      console.log("time complete");
    }, 2000);
    console.log("hello form after time");
    const indexRequestButton = document.querySelector("span.cTsG4");
    //  const indexRequestButton = document.querySelector('span.cTsG4');
    if (indexRequestButton) {
      indexRequestButton.click();
    }
  };

  const processProgress = () => {
    scrapeHandler();
  };
  const readExcelFile = (file) => {
    const reader = new FileReader();
    // console.log("XLSX available?", typeof XLSX); // should log 'function' or 'object'

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Excel Data:", jsonData);
    };
  
    reader.readAsArrayBuffer(file);
  }

  const handleNextProcess = () => {
    document
      .getElementById("index-request-submit-btn")
      .addEventListener("click", () => {
        const fileInput = document.querySelector(
          '#progress-container input[type="file"]'
        );
        let updatedFile = null
        if (fileInput && fileInput.files.length > 0) {
           updatedFile = fileInput.files[0]; // Store the selected file
          console.log("Selected File:", updatedFile);
        }
        const container = document.getElementById("progress-container");
        if (container) container.remove(); // Hide modal
        // if (typeof processStarted === "function") processStarted(); // Call your function

        console.log("Hello 999999999");

        if ( updatedFile && updatedFile.name.endsWith(".xlsx")) {
          readExcelFile(updatedFile);
        } else {
          console.warn("Please select a valid .xlsx file");
        }
        



      });
  };
  try {
    createProgressStatus();
    handleNextProcess();
    return;
    //This is Real Function Section
    if (window.continueScraping) {
      return;
    }
    window.continueScraping = true;

    await processProgress();
  } catch (error) {
    console.log("Error form clickSubmitButton :-", error);
  }
};

document
  .getElementById("csvInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const fileLabel = document.getElementById("file-label");

      fileLabel.innerHTML = `Upload file: ${file.name}`;
    }
  });

document.getElementById("clickSubmit").addEventListener("click", async () => {
  const submitButton = document.getElementById("clickSubmit");
  const fileInput = document.getElementById("csvInput");
  let jsonData = null;

  submitButton.disabled = true;
  if (fileInput && fileInput.files.length > 0) {
    jsonData = await fileToJson(fileInput.files[0]);
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: clickSubmitButton,
      args: [jsonData],
    });
  });
});
const fileToJson = async (updatedFile) => {
  try {
    const csvData = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        resolve(e.target.result);
      };

      reader.onerror = function (e) {
        reject(e);
      };

      reader.readAsText(updatedFile);
    });

    // Convert CSV string to JSON
    const jsonData = csvToJson(csvData);
    return jsonData;
  } catch (error) {
    console.error("Error parsing file:", error);
    return [];
  }
};
const csvToJson = (csv) => {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || "";
      return obj;
    }, {});
  });
};
// text-token-text-error
const clickSubmitButton = async (jsonData = []) => {
  const serverDomain = "https://server.somacharnews.com";
  // const serverDomain = 'http://localhost:8001'
  const getUrl = async () => {
    try {
      let data = await fetch(
        `${serverDomain}/chrome-extension/google-index-bot/get-collected-url`,
        {
          method: "GET",
        }
      );
      data = await data.json();
      return data;
    } catch (error) {
      return;
    }
  };
  const updateIndexUrl = async (id) => {
    try {
      let data = await fetch(
        `${serverDomain}/chrome-extension/google-index-bot/update-index-url?id=${id}`,
        {
          method: "GET",
        }
      );
      data = await data.json();
      return data;
    } catch (error) {
      return;
    }
  };
  const waitHere = (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("done");
      }, time || 100);
    });
  };
  const checkRetrievingDataModalProgress = (time = 1000, selector) => {
    return new Promise((resolve, reject) => {
      if (!selector) {
        resolve("Query selector are required");
      }
      let intervalContainer = setInterval(() => {
        const checkOutputProcessing = document.querySelector(selector);
        if (!checkOutputProcessing) {
          setTimeout(() => {
            clearInterval(intervalContainer);
            resolve("done");
          }, time);
        }
      }, time);
    });
  };
  const awaitForGetElement = (time = 1000, selector) => {
    return new Promise((resolve, reject) => {
      if (!selector) {
        resolve("Query selector are required");
      }
      let intervalContainer = setInterval(() => {
        const checkOutputProcessing = document.querySelector(selector);
        if (checkOutputProcessing) {
          setTimeout(() => {
            clearInterval(intervalContainer);
            resolve("done");
          }, time);
        }
      }, time);
    });
  };
  const scrapeHandler = async () => {
    try {
      const { totalUrls, data } = await getUrl();
      if (!data) {
        return;
      }
      const url = data.url;

      const searchInputField = document.querySelector("input.Ax4B8.ZAGvjd");
      if (searchInputField) {
        searchInputField.value = url;
        searchInputField.dispatchEvent(new Event("input", { bubbles: true }));
        searchInputField.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
      });
    
      searchInputField.dispatchEvent(enterEvent);
      
      const cancelButton = document.querySelector(
        'button[data-mdc-dialog-action="cancel"]'
      );

      const retrieveModalSelector = `button[data-mdc-dialog-action="cancel"]`;
      await checkRetrievingDataModalProgress(2000, retrieveModalSelector);

      await waitHere(5000);

      const indexRequestButton = document.querySelector("span.cTsG4");
      if (indexRequestButton) {
        indexRequestButton.click();
      }

      await checkRetrievingDataModalProgress(2000, retrieveModalSelector);
      await waitHere(5000);
      const dismissBtnSelector = `button[data-mdc-dialog-action="ok"]`;
      const dismissButton = document.querySelector(dismissBtnSelector);

      await awaitForGetElement(1000, dismissBtnSelector);
      const indexedVerifierElement = document.querySelector("h2.tg7tld.OPBkGc");
      if (
        indexedVerifierElement &&
        indexedVerifierElement.innerText.includes("Indexing requested")
      ) {
         updateIndexUrl(data._id);
      }
console.log("dismissButton -->>>", dismissButton)
      if (dismissButton) {
        dismissButton.click();
      }

      const minutes = 1;
      await waitHere(minutes * 60 * 1000);
      scrapeHandler();
    } catch (error) {
      scrapeHandler();
    }
  };

  const saveToDB = async (jsonData) => {
    try {
      await fetch(`${serverDomain}/chrome-extension/google-index-bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: jsonData,
        }),
      });
      return;
    } catch (error) {
      console.log("error ---->>>", error);
      return;
    }
  };

  try {
    // if (window.continueScraping) {
    //   return;
    // }
    // window.continueScraping = true;
    if (jsonData) {
      await saveToDB(jsonData);
    }
    await scrapeHandler();
  } catch (error) {
    console.log("Error form clickSubmitButton :-", error);
  }
};

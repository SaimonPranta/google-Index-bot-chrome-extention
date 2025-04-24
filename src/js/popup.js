


document.getElementById('csvInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const submitButton = document.getElementById("clickSubmit");
    const fileLabel = document.getElementById("file-label");
    submitButton.disabled = false;
    fileLabel.innerHTML = `Upload file: ${file.name}`

  }
});

document.getElementById("clickSubmit").addEventListener("click", async () => {
  const fileInput = document.getElementById(
    'csvInput'
  );
  let jsonData = null

  if (fileInput && fileInput.files.length > 0) {
    jsonData = await fileToJson(fileInput.files[0]);
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: clickSubmitButton,
      args: [jsonData]
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
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
      return obj;
    }, {});
  });
};
// text-token-text-error
const clickSubmitButton = async (jsonData = []) => {
  const serverDomain = 'http://localhost:8001'
  const getUrl = async () => {
    try {
      let data = await fetch(
        `${serverDomain}/chrome-extension/google-index-bot/get-collected-url`,
        {
          method: "GET",
        }
      );
      data = await data.json()
      console.log("data -->>", data)
      return data
    } catch (error) {
      return
    }
  }
  const updateIndexUrl = async (id) => {
    try {
      let data = await fetch(
        `${serverDomain}/chrome-extension/google-index-bot/update-index-url?id=${id}`,
        {
          method: "GET",
        }
      );
      data = await data.json()
      console.log("data -->>", data)
      return data
    } catch (error) {
      return
    }
  }
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
      const { totalUrls, data } = await getUrl()
      console.log("urlInfo -->>", data)
      if (!data) {
        return
      }
      const url = data.url

      const searchInputField = document.querySelector("input.Ax4B8.ZAGvjd");
      if (searchInputField) {
        console.log("hello if");
        searchInputField.value = url
        searchInputField.dispatchEvent(new Event("input", { bubbles: true }));
        searchInputField.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const searchButton = document.querySelector('button[aria-label="Search"]');

      if (searchButton) {
        searchButton.click();
      }
      const cancelButton = document.querySelector('button[data-mdc-dialog-action="cancel"]');

      const retrieveModalSelector = `button[data-mdc-dialog-action="cancel"]`
      await checkRetrievingDataModalProgress(2000, retrieveModalSelector)

      await waitHere(5000)

      const indexRequestButton = document.querySelector("span.cTsG4");
      if (indexRequestButton) {
        indexRequestButton.click();
      }
      await updateIndexUrl(data._id)

      // <div jsslot="" class="uW2Fw-cnG4Wd" jsname="rZHESd"><div class="LKPgTd"><div class="UZY8u">Testing if live URL can be indexed</div><div jscontroller="oJz28e" class="ErQSec-qNpTzb-MkD1Ye S15xnb" data-progressvalue="0.2" data-buffervalue="1" jsname="N9Omdd" jsaction="transitionend:e204de"><div class="ErQSec-qNpTzb-P1ekSe ErQSec-qNpTzb-P1ekSe-OWXEXe-A9y3zc ErQSec-qNpTzb-P1ekSe-OWXEXe-OiiCO-IhfUye" role="progressbar" aria-label="Testing if live URL can be indexed" jsname="LbNpof"><div class="ErQSec-qNpTzb-BEcm3d-LK5yu" style="" jsname="XCKw4c"></div><div class="ErQSec-qNpTzb-OcUoKf-LK5yu" style="" jsname="IGn7me"></div><div class="ErQSec-qNpTzb-oLOYtf-uDEFge" jsname="NIZIe"></div><div class="ErQSec-qNpTzb-OcUoKf-qwU8Me" style="" jsname="YUkMeb"></div><div class="ErQSec-qNpTzb-BEcm3d-qwU8Me" style="" jsname="SBP9"><div class="ErQSec-qNpTzb-ajuXxc-RxYbNe"></div></div><div class="ErQSec-qNpTzb-Ejc3of-uDEFge" jsname="MMMbxf"></div></div></div><div class="YybJub">This might take a minute or two</div><div class="VfPpkd-dgl2Hf-ppHlrf-sM5MNb" data-is-touch-wrapper="true"><button class="mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-dgl2Hf H7EDqc" jscontroller="O626Fe" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox; focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="H7EDqc" data-mdc-dialog-action="cancel"><span class="OiePBf-zPjgPe"></span><span class="RBHQF-ksKsZd" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="mUIrbf-RLmnJb"></span><span class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-M1Soyc" jsname="Xr1QTb"></span><span jsname="V67aGc" class="mUIrbf-vQzf8d">Cancel</span><span class="mUIrbf-kBDsod-Rtc0Jf mUIrbf-kBDsod-Rtc0Jf-OWXEXe-UbuQg" jsname="UkTUqb"></span></button></div></div></div>
      
      await checkRetrievingDataModalProgress(2000, retrieveModalSelector)
      await waitHere(5000)
      const dismissBtnSelector = `button[data-mdc-dialog-action="ok"]`
      const dismissButton = document.querySelector(dismissBtnSelector);

      console.log("dismissButton 1 ==>>", dismissButton)
      await awaitForGetElement(1000, dismissBtnSelector)
      console.log("dismissButton 2 ==>>", dismissButton)

      if (dismissButton) {
        dismissButton.click();
      }
      scrapeHandler()
    } catch (error) {
      scrapeHandler()
    }
  };


  const saveToDB = async (jsonData) => {
    try {
      console.log("jsonData -->>", jsonData)
      await fetch(
        `${serverDomain}/chrome-extension/google-index-bot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: jsonData
          }),
        }
      );
      return
    } catch (error) {
      console.log("error ---->>>", error)
      return
    }
  }

  try {
    // if (window.continueScraping) {
    //   return;
    // }
    // window.continueScraping = true;
    await saveToDB(jsonData)
    await scrapeHandler();
  } catch (error) {
    console.log("Error form clickSubmitButton :-", error);
  }
};

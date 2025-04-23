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
  const serverDomain = "https://server.somacharnews.com"; 
  const processProgress = () => {

  };

  try {
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

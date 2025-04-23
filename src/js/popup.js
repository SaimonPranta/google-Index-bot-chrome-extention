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
  console.log("hello wrold");
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

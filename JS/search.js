function googleSearch(){
    const searchTerm = document.getElementById("search_input").ariaValueMax;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponet(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}
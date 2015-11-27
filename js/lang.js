
(function(){
    function setHtmlLang(lang) {
        if(lang.toLowerCase().indexOf("pt") !== -1) lang = "pt";
        if(["en","pt"].indexOf(lang) === -1) lang = "en";

        document.getElementsByTagName("html")[0].setAttribute("lang", lang);
        localStorage.setItem("savedLang", lang);
    }

    function getHtmlLang() {
        return document.getElementsByTagName("html")[0].getAttribute("lang");
    }

    function getUserLang() {
        var browserLang = window.navigator.userLanguage || window.navigator.language;
        var savedLang = localStorage.getItem("savedLang");

        return savedLang || browserLang;
    }

    setHtmlLang(getUserLang());

    window.onload = function() {
        document.getElementById("lang-pt").onclick = function(){
            setHtmlLang("pt");
        }

        document.getElementById("lang-en").onclick = function(){
            setHtmlLang("en");
        }
    }

})();

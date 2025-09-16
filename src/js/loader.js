class Loader extends HTMLElement{
    constructor(){
        super();
        const template = $("#loading_api_screen").get(0)
        this.appendChild(template.content.cloneNode(true))
    }
    connectedCallback(){
        this.initLoadingFunction()
    }
    initLoadingFunction(){
    window.addEventListener("load", () => {
      setTimeout(() => {
        const el = document.getElementById("loading-screen");
        el.style.opacity = "0";
        setTimeout(() => (el.style.display = "none"), 100);
      }, 1000);
    });
    }
}
customElements.define("custom-loader",Loader)
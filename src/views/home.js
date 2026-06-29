import { html } from "../lib.js";

window.onload = () => document.querySelector('#visible').style.display = 'block';

const homeTempl = () => html`
<div class="img-box">
    <img class="wrapper" src="images/vilna.jpg">
</div>`;

export function homePage(ctx) {
    ctx.render(homeTempl());
    ctx.updateNav;
}



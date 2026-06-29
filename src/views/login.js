import { login } from "../apiData/api.js";
import { html } from "../lib.js";


const loginTempl = (onSubmit) => html`
<div id="exercise">
    <div class="wrapper">
        <div class="card-wrapper">
            <div class="row">
                <div class="col-md-12">
                    <h2>Вход</h2>
                    <form @submit=${onSubmit} action="/login" method="post">
                        <label>Потребител: <input type="text" name="username"></label>
                        <label>Парола: <input type="password" name="password"></label>
                        <button>Вход</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>`;

export function loginPage(ctx) {
    ctx.render(loginTempl(onSubmit));

    async function onSubmit(ev) {
        ev.preventDefault();

        const formData = new FormData(ev.target);
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();

        if (username == '' || password == '') {
            return alert("Fill all fields!");
        }

        await login(username, password);
        ctx.updateNav();
        ctx.page.redirect('/edit');
    }
}

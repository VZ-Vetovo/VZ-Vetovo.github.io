import { delPost, getPosts, getUserData, loader, newPost } from "../apiData/data.js";
import { html } from "../lib.js";

const postTempl = (posts, onPub, onDelete, admin) => html`
<div id="exercise">
    <div class="wrapper">
        <div class="card-wrapper">
            <h1>Обяви, Мнения и Коментари.</h1>
            <p>Текст: 
                <input id="content" class="post"/>
            </p>
            <p>Автор: 
                <input id="author" class="author"/>
            </p>
            <button @click=${onPub}>Публикувай</button>
        </div>
        ${posts.length == 0
            ? html`Въведете първият коментар!`
            : posts.map(i => card(i, onDelete, admin))}
    </div>
</div>`;

const card = (item, onDelete, admin) => html`
<div class="card-wrapper">
    <p>${item.content}</p>
    <p>Публикувано на: ${item.createdAt.split('T')[0]} -- от: ${item.author}</p>
    ${ admin != null
        ? html`<button id=${item.objectId} @click=${onDelete}>Изтрий</button>`
        : null
    }
</div>`;

export async function postsPage(ctx) {
    ctx.render(loader());

    const items = await getPosts();
    const posts = items.results
    const admin = getUserData();
    ctx.render(postTempl(posts, onPub, onDelete, admin));

    async function onPub() {
        const content = document.querySelector('#content').value.trim();
        const author = document.querySelector('#author').value.trim();

        if (content == '' || author == '') {
            return alert('Попълни полетата, преди публикация!')
        }
        const data = { content, author};

        ctx.render(loader());
        await newPost(data);
        ctx.page.redirect(`/forum`);
    }

    async function onDelete(e) {
        ctx.render(loader());
        await delPost(e.target.id);
        ctx.page.redirect(`/forum`);
    }
}
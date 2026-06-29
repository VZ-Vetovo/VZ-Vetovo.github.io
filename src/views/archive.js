import { getAllIndications, loader } from "../apiData/data.js";
import { html } from "../lib.js";

const choiseTempl = (ind, onShow) => html`
<div id="exercise">
    <div class="wrapper">
        <div class="card-wrapper">
            <div class="row">
                <div class="col-md-12">
                <label class="arch" for="inter">Архив от дата:</label>
                    ${ind.length > 0
                        ? html`<select name="inter" id="inter">
                                    ${ind.map(card)}
                                </select>
                                <button @click=${onShow}>Покажи</button>`
                        : html`<p>Няма данни!</p>`}
                </div>
            </div>
        </div>
        <div class="arch-data"></div>
    </div>
</div>`;

const card = (d) => html`<option value=${d.objectId}>${d.createdAt.split('T')[0]}</option>`;

const archTempl = (indications, created, onClear) => html`
<div id="exercise">
    <div class="card-wrapper">
        <div class="row">
            <div class="col-md-12">
                <table class="table">
                    <h1>Показания от: ${created.split('T')[0]}</h1>
                    <thead>
                        <tr>
                            <th>Ел.№</th>
                            <th>Потребител</th>
                            <th>Старо</th>
                            <th>Ново</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.values(indications).map(cardArch)}
                    </tbody>
                </table>
                <button @click=${onClear}>Изчисти</button>
            </div>
        </div>
    </div>
</div>`;

const cardArch = (item) => html`
<tr>
    <td>${item.elN}</td>
    <td>${item.name}</td>
    <td>${item.old}</td>
    <td>${item.new}</td>
</tr>`;

export async function archivePage(ctx) {
    ctx.render(loader());

    const data = await getAllIndications();
    const ind = data.results;

    ctx.render(choiseTempl(ind, onShow));
    
    function onShow() {
        const indId = document.querySelector('#inter').value;
        const data = ind.find(i => i.objectId == indId);

        ctx.render(archTempl(data.units, data.createdAt, onClear));
    }

    function onClear() {
        ctx.render(choiseTempl(ind, onShow));
    }
}
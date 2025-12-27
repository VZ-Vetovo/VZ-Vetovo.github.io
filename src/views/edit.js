import { getLastIndication, getTaxes, loader, updateThisIndication} from "../apiData/data.js";
import { html, render } from "../lib.js";
import { download, toCsv } from "./download.js";

const editTempl = (data, onSave, onNew, onExport, onDelete, kilowats, momentSum, totalSum, tax, price) => html`
<div id="container">
    <div id="exercise">
        <h1>Корекции за: ${data.createdAt.split('T')[0]}</h1>

        <div class="wrapper">
            <div class="card-wrapper">
                <div class="row">
                    <div class="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Ел.№</th>
                                    <th>Потребител</th>
                                    <th>Тел.№</th>
                                    <th>Бележка</th>
                                    <th>Старо</th>
                                    <th>Ново</th>
                                    <th>Разлика</th>
                                    <th>Сума</th>
                                    <th>Платено</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                ${Object.values(data.units).map(u => card(u, tax, price))}
                                <div></div>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>Наличнoст КАСА:</th>
                                    <th>${momentSum.toFixed(2)}лв/${toEuro(momentSum)}€</th>
                                    <th></th>
                                    <th></th>
                                    <th>Общо:</th>
                                    <th>${kilowats}кВ</th>
                                    <th>${totalSum.toFixed(2)}лв/${toEuro(totalSum)}€</th>
                                </tr>
                            </tfoot>
                        </table>
                        <button @click=${onSave}>Запази Промените</button>
                        <button @click=${onNew}>Добави нов абонат</button>
                        <button @click=${onDelete}>Итрий абонат № <input id='del-user'/></button>
                        <button @click=${onExport}>Свали Данни</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

const card = (item, tax, price) => html`
<tr class=${item.paid ? "paid" : "unpaid"}>
    <td>
        <input class="elN" .value=${item.elN}/>
    </td>
    <td>
        <input class="name" .value=${item.name}/>
    </td>
    <td>
        <input class="phone" .value=${item.phone}/> 
    </td>
    <td>
        <input class="note" .value=${item.note}/> 
    </td>
    <td>
        <input class="old" .value=${item.old}/>
    </td>
    <td>
        <input class="new" .value=${item.new}/>
    </td>
    <td>
        ${Number(item.new) - Number(item.old)}
    </td>
    <td>
        ${item.elN == '99'
            ? getBill(item.new, item.old, price, 0).toFixed(2) + 'лв/' + toEuro(getBill(item.new, item.old, price, 0)) + '€'
            : getBill(item.new, item.old, price, tax).toFixed(2) + 'лв/' + toEuro(getBill(item.new, item.old, price, tax)) + '€'}
    </td>
    <td>
        ${item.paid
            ? html`<input class="check" type="checkbox" checked/>`
            : html`<input class="check" type="checkbox"/>`}
        
    </td>
</tr>`;

function toEuro(value) {
    const fixing = 1.95583;
    return (value / fixing).toFixed(2);
}

function getBill(newInd, oldInd, price, tax) {
    return (Number(newInd) - Number(oldInd)) * price + tax;
}

export async function editPage(ctx) {
    ctx.render(loader());

    const [items, taxes] = await Promise.all([
        getLastIndication(),
        getTaxes()
    ]); 
    const data = items.results[0];
    const tax = taxes.results[0].tax;
    const price = taxes.results[0].kWprice;

    let kilowats = 0;
    let momentSum = 0;
    let totalSum = 0;
    Object.values(data.units).forEach(v => {
        if (v.elN != '99') {
            const difference = Number(v.new) - Number(v.old);
            if(v.paid) {
                momentSum += difference * price + tax;
            }
            totalSum += difference * price + tax;
            kilowats += difference;
        }
    })

    ctx.render(editTempl(data, onSave, onNew, onExport, onDelete, kilowats, momentSum, totalSum, tax, price));

    async function onSave() {
        const rows = document.querySelectorAll('tbody tr');
        const newdata = {
            units: {}
        }
        rows.forEach(r => {
            const vals = r.querySelectorAll('input');
            const num = r.querySelector('.elN').value;
            newdata.units[num] = {}
            newdata.units[num].paid = r.querySelector('.check').checked
            vals.forEach(v => {
                newdata.units[num][v.className] = v.value
            })
        })
        ctx.render(loader());
        await updateThisIndication(newdata, data.objectId);
        ctx.page.redirect(`/indications`);
    }

    function onNew() {
        const tabl = document.querySelector('tbody');
        const newRow = card({
            'paid': true,
            'elN': '',
            'name': '',
            'phone': '',
            'note': '',
            'old': 0,
            'new': 0,
        }, tax, price);
        render(newRow, tabl);
    }

    async function onDelete() {
        const delField = document.querySelector('#del-user');
        const dellUser = delField.value;
        if (Object.keys(data.units).includes(dellUser)) {
            const conf = confirm(`Желаете ли да изтриете абонат № ${dellUser}`);
            if (conf){
                delete data.units[dellUser];
                delete data.createdAt;
                delete data.updatedAt;

                ctx.render(loader());
                await updateThisIndication(data, data.objectId);
                ctx.page.redirect(`/indications`);
            } else {
                delField.value = '';
            }
        } else {
            delField.value = '';
        }
    }

    function onExport() {
        const table = document.querySelector('table');
        const csv = toCsv(table);
        download(csv, 'download.csv');
    }
}

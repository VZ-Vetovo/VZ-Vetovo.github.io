import { getLastIndication, loader, getTaxes } from "../apiData/data.js";
import { html } from "../lib.js";

const allTempl = (data, tax, price) => html`
<div id="container">
    <div id="exercise">
        <h1>Отчетени показания до: ${data.createdAt.split('T')[0]}</h1>
        <div class="wrapper">
            <div class="card-wrapper">
                <div class="row">
                    <div class="col-md-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Ел.№</th>
                                    <th>Потребител</th>
                                    <th>Старо</th>
                                    <th>Ново</th>
                                    <th>Разлика</th>
                                    <th>Сума</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.values(data.units).map(u => card(u, tax, price))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="6">* Сумите са формирани от такса - ${tax.toFixed(2)}лв/${toEuro(tax)}€ + цена за кВт - ${price}лв/${toEuro(price)}€.</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th colspan="4">За информация Н.Георгиева: 0885805644</th>
                                </tr>
                                <tr>
                                    <th></th>
                                    <th class="paid">Платено</th>
                                    <th></th>
                                    <th></th>
                                    <th class="unpaid">Неплатено</th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

const card = (item, tax, price) => html`
    ${item.elN == '99'
        ? null
        : html`
<tr class=${item.paid ? "paid" : "unpaid"}>
    <td>
        <p>${item.elN}</p>
    </td>
    <td>
        <p>${item.name}</p>
    </td>
    <td>
        <p>${item.old}</p>
    </td>
    <td>
        <p>${item.new}</p>
    </td>
    <td>
        <p>${Number(item.new) - Number(item.old)}</p>
    </td>
    <td>
        <p>${getBill(item.new, item.old, price, tax).toFixed(2)}лв/${toEuro(getBill(item.new, item.old, price, tax))}€</p>
    </td>
</tr>`}`;

function toEuro(value) {
    const fixing = 1.95583;
    return (value / fixing).toFixed(2);
}

function getBill(newInd, oldInd, price, tax) {
    return (Number(newInd) - Number(oldInd)) * price + tax;
}

export async function unitsPage(ctx) {
    ctx.render(loader());
    const [items, taxes] = await Promise.all([
        getLastIndication(),
        getTaxes()
    ]); 
    const data = items.results[0];
    const tax = taxes.results[0].tax;
    const price = taxes.results[0].kWprice;

    ctx.render(allTempl(data, tax, price));
}

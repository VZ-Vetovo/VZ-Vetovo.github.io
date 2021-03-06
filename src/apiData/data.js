import { html } from '../lib.js';
import * as api from './api.js';

export const loader = () => html`<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

export async function getAllIndications(){
    return api.get('/classes/indication?order=-createdAt');    
}

export async function getLastIndication(){
    return api.get('/classes/indication?order=-createdAt&limit=1');    
}

export async function getPosts(){
    return api.get(`/classes/posts?order=-createdAt`);    
}

export async function newPost(data) {
    return api.post('/classes/posts', data);
}

export async function delPost(id) {
    return api.del('/classes/posts/' + id);
}

export async function saveNewIndication(data) {
    return api.post('/classes/indication', data);
}

export async function updateThisIndication(data, id) {
    return api.put('/classes/indication/' + id, data);
}

export async function getTaxes(){
    return api.get(`/classes/taxes`);
}

export async function updateTaxes(data, id) {
    return api.put('/classes/taxes/' + id, data);
}

export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}
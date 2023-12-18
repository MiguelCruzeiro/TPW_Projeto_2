import { Injectable } from '@angular/core';
import {author, news, publisher, user} from "./interfaces";

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL = 'http://localhost:8000';

  constructor() { }

  async login(u_name: string, password: string): Promise<any> {
    const url = this.baseURL + '/login';
    const data = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({username: u_name, password: password}) });
    if (!data.ok) {
      return "ERROR";
    }
    return await data.json() ?? undefined;
  }

  async getNews(): Promise<news[]> {
    const url = this.baseURL + '/news';
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async getNew(id: number): Promise<news> {
    const url = this.baseURL + '/news/' + id;
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async deleteNew(id: number): Promise<any> {
    const url = this.baseURL + '/news/' + id;
    const data = await fetch(url, {method: 'DELETE'});
    return await data.statusText ?? undefined;
  }

  async updateNew(news : news): Promise<news> {
    const id = news.id;
    const url = this.baseURL + '/news/' + id;
    const data = await fetch(url, {method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(news) });
    return await data.json() ?? undefined;
  }

  async getUsers(): Promise<user[]> {
    const url = this.baseURL + '/users';
    const data = await fetch(url, {method: 'GET' });
    return await data.json() ?? undefined;
  }

  async getUser(id: number): Promise<user> {
    const url = this.baseURL + '/users/' + id;
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async deleteUser(id: number): Promise<any> {
    const url = this.baseURL + '/users/' + id;
    const data = await fetch(url, {method: 'DELETE'});
    return await data.statusText ?? undefined;
  }

  async getAuthor(id: number): Promise<author> {
    const url = this.baseURL + '/authors/' + id;
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async getPublishers(): Promise<publisher> {
    const url = this.baseURL + '/publishers';
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async getPublisher(id:number): Promise<publisher> {
    const url = this.baseURL + '/publishers/' + id;
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async getAuthorNews(id:number): Promise<news[]> {
    const url = this.baseURL + '/authors/' + id + '/news';
    const data = await fetch(url, {method: 'GET'});
    return await data.json() ?? undefined;
  }

  async registerUser(json:{email:string,password:string,username:string,firstName:string,lastName:string}): Promise<any> {
    const url = this.baseURL + '/register';
    const data = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) });
    return await data.statusText ?? undefined;
  }

    async createNews(json:{title:string|undefined,description:string|undefined,content:string|undefined,published_by:number|undefined,tags:any[]}): Promise<any> {
      const url = this.baseURL + '/news/';
      console.log("json",json);
      const data = await fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) });
      return await data.statusText ?? undefined;
    }

}

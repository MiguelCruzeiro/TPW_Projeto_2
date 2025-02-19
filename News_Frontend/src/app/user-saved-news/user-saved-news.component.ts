import { Component, inject} from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsCardDarkComponent } from '../news-card-dark/news-card-dark.component';
import { NewsCardLightComponent } from '../news-card-light/news-card-light.component';
import {ApiDataService} from "../api-data.service";
import {author, news, publisher, user} from "../interfaces";
import {NgIf, NgFor} from "@angular/common";
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-saved-news',
  standalone: true,
  imports: [NewsCardComponent, NewsCardDarkComponent, NewsCardLightComponent, NgIf, NgFor, NavbarComponent],
  templateUrl: './user-saved-news.component.html',
  styleUrl: './user-saved-news.component.css'
})
export class UserSavedNewsComponent {
  ApiDataService = inject(ApiDataService);
  AuthService = inject(AuthService);
  newsArticles: any[] = [];
  selectedNews: any = null;
  authors: Map<number, string> = new Map<number, string>();
  currentUser = localStorage.getItem('currentUser');
  userId = localStorage.getItem('currentUserId');
  user_saved_news: any[] = [];

  constructor(private router: Router) {
    this.currentUser = this.AuthService.getUser();
    if (typeof localStorage !== 'undefined') {
      this.userId = localStorage.getItem('currentUserId');
    }
    this.ApiDataService.getNewsByUser(Number(this.userId)).then((news : any) => {
      console.log(news);
      this.user_saved_news = news;

      for (let i = 0; i < this.user_saved_news.length; i++) {
        const putblished = this.user_saved_news[i].published_by;
        this.ApiDataService.getAuthor(putblished).then((author : author) => {
          //console.log(author);
          this.ApiDataService.getUser(author.user).then((user : user) => {
            //console.log(user);
            this.authors.set(this.user_saved_news[i].id, user.username);
          });
        });
      }
      //console.log(this.newsArticles);
    });
  }

  redirectAuthor(news : news) {
    this.selectedNews = news;
    const author_id = news.published_by;

    this.router.navigate(['/author', author_id]);

  }

  saveNews(news : news) {
    this.selectedNews = news;
    const user_id = this.userId

    this.ApiDataService.saveNews(news.id, user_id).then((data : any) => {
      console.log(data);
      this.ApiDataService.getNewsByUser(Number(this.userId)).then((news : any) => {
        console.log(news);
        this.user_saved_news = news;
      });
      if (data == "ERROR") {
        return;
      }
      else{
        console.log("News saved");
      }
    });
  }

  unsaveNews(news : news) {
    this.selectedNews = news;
    const user_id = this.userId

    this.ApiDataService.unsaveNews(news.id, user_id).then((data : any) => {
      console.log(data);
      this.ApiDataService.getNewsByUser(Number(this.userId)).then((news : any) => {
        console.log(news);
        this.user_saved_news = news;
      });
      if (data == "ERROR") {
        return;
      }
      else{
        console.log("News unsaved");
      }
    });
  }

  is_saved(news : news) {
    for (let i = 0; i < this.user_saved_news.length; i++) {
      if (this.user_saved_news[i].id == news.id) {
        return true;
      }
    }
    return false;
  }

}
